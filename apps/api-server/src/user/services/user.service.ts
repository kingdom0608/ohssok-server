import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DOMAINS,
  EncryptionHelper,
  EUserAccountErrorMessage,
  EUserAccountProvider,
  EUserAccountStatus,
  EUserAuthErrorMessage,
  EUserErrorMessage,
  EUserRole,
  EUserStatus,
  findPagination,
  responsePagination,
  User,
  UserAccount,
} from '@app/common';
import { DataSource, EntityManager, In, Like, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectDataSource(DOMAINS.User)
    private dataSource: DataSource,
    @InjectRepository(User, DOMAINS.User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAccount, DOMAINS.User)
    private readonly userAccountRepository: Repository<UserAccount>,
    private readonly encryptionHelper: EncryptionHelper,
  ) {}

  /**
   * 유저 생성
   * @param userData
   */
  async createUser(userData: {
    name: string;
    displayName: string;
    phoneNumber: string;
    birthday: Date;
    address?: string;
    zipCode?: string;
    detailAddress?: string;
    status?: EUserStatus;
    role: EUserRole;
    accounts: Array<{
      uid: string;
      password?: string;
      provider: EUserAccountProvider;
      status?: EUserAccountStatus;
    }>;
    conditionRelations: Array<{
      conditionId: number;
    }>;
  }): Promise<User> {
    let createUser: User;
    let createUserAccount: UserAccount;

    if (userData.accounts.length !== 1) {
      throw new BadRequestException(EUserAccountErrorMessage.USER_BAD_REQUEST);
    }

    /** 데이터 전처리 */
    userData.status = EUserStatus.ACTIVE;
    userData.accounts[0].status = EUserAccountStatus.ACTIVE;

    /** sns 로그인 아닌 경우 */
    if (userData.accounts[0].password) {
      userData.accounts[0].password = this.encryptionHelper.encryptForPassword(
        userData.accounts[0].password,
      );
    }

    await this.dataSource.transaction(async (manager: EntityManager) => {
      /** 유저 조회 */
      const getUser: User = await manager.findOne(User, {
        where: {
          phoneNumber: userData.phoneNumber,
          status: EUserStatus.ACTIVE,
        },
      });

      /** 유저 아이디 중복확인 */
      const getAccount: UserAccount = await manager.findOne(UserAccount, {
        where: {
          uid: userData.accounts[0].uid,
          status: EUserAccountStatus.ACTIVE,
        },
      });

      if (getAccount) {
        throw new ConflictException(
          EUserAccountErrorMessage.USER_ACCOUNT_CONFLICT,
        );
      }

      if (getUser) {
        /** 유저 계정 조회 */
        const getUserAccount: UserAccount = await manager.findOne(UserAccount, {
          where: {
            userId: getUser.id,
            provider: userData.accounts[0].provider,
            status: EUserAccountStatus.ACTIVE,
          },
        });

        if (getUserAccount) {
          throw new ConflictException(
            EUserAccountErrorMessage.USER_ACCOUNT_CONFLICT,
          );
        }

        /** 유저 계정만 생성 */
        createUserAccount = manager.create(UserAccount, {
          userId: getUser.id,
          ...userData.accounts[0],
        });

        await manager.save(createUserAccount);
      } else {
        /** 유저 생성 */
        createUser = manager.create(User, {
          ...userData,
        });

        await manager.save(createUser);
      }
    });

    return this.userRepository.findOne({
      where: {
        phoneNumber: userData.phoneNumber,
      },
    });
  }

  /**
   * 어드민 유저 생성
   * @param userData
   */
  async createAdminUserForAdmin(userData: {
    name: string;
    displayName: string;
    phoneNumber: string;
    birthday: Date;
    address: string;
    zipCode: string;
    detailAddress?: string;
    status?: EUserStatus;
    role: EUserRole;
    accounts: Array<{
      uid: string;
      password?: string;
      provider: EUserAccountProvider;
      status?: EUserAccountStatus;
    }>;
  }): Promise<User> {
    let createUser: User;

    if (userData.accounts.length !== 1) {
      throw new BadRequestException(EUserAccountErrorMessage.USER_BAD_REQUEST);
    }

    /** 데이터 전처리 */
    userData.status = EUserStatus.ACTIVE;
    userData.accounts[0].status = EUserAccountStatus.ACTIVE;

    /** sns 로그인 아닌 경우 */
    if (userData.accounts[0].password) {
      userData.accounts[0].password = this.encryptionHelper.encryptForPassword(
        userData.accounts[0].password,
      );
    }

    await this.dataSource.transaction(async (manager: EntityManager) => {
      /** 유저 계정 조회 */
      const getUser = await manager.findOne(User, {
        where: {
          phoneNumber: userData.phoneNumber,
          role: userData.role,
        },
      });

      if (getUser) {
        throw new ConflictException(
          EUserAccountErrorMessage.USER_ADMIN_ACCOUNT_CONFLICT,
        );
      }

      /** 유저 생성 */
      createUser = manager.create(User, {
        ...userData,
      });

      await manager.save(createUser);
    });

    delete createUser.accounts[0].password;

    return {
      ...createUser,
    };
  }

  /**
   * 유저 복수 조회
   * @param query
   */
  async listUser(query) {
    const { offset, page, size, sortBy, ...data } = query;
    const where = {
      ...data,
    };

    if (data.name) {
      where.name = Like(`%${data.name}%`);
    }

    if (data.displayName) {
      where.displayName = Like(`%${data.displayName}%`);
    }

    if (data.phoneNumber) {
      where.phoneNumber = Like(`%${data.phoneNumber}%`);
    }

    if (data.roles) {
      delete where.roles;
      where.role = In(data.roles.split(','));
    }

    if (data.statuses) {
      delete where.statuses;
      where.status = In(data.statuses.split(','));
    }

    // account
    if (data.uid) {
      delete where.uid;
      where.accounts = { uid: Like(`%${data.uid}%`) };
    }

    const [list, total] = await this.userRepository.findAndCount({
      where: where,
      relations: {
        accounts: true,
      },
      ...findPagination({ offset, page, size, sortBy }),
    });

    const users = list.map((user) => {
      user.accounts = user.accounts.map((account) => {
        delete account.password;
        delete account.refreshToken;
        return account;
      });
      return user;
    });

    const pagination = responsePagination(total, list.length, query);

    return { list: users, pagination: pagination };
  }

  /**
   * 유저 아이디 조회
   * @param id
   */
  async getUserById(id: number): Promise<User> {
    const getUser = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['accounts'],
    });

    if (!getUser) {
      throw new NotFoundException(EUserErrorMessage.USER_NOT_FOUND);
    }

    getUser.accounts = getUser.accounts.map((account) => {
      delete account.password;
      delete account.refreshToken;
      return account;
    });

    return getUser;
  }

  /**
   * 비밀번호 초기화 전용 유저 조회
   * @param id
   * @param userData
   */
  async getUserByIdForPasswordReset(
    id: number,
    userData: {
      nowPassword: string;
    },
  ): Promise<User> {
    const getUser = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['accounts'],
    });

    if (!getUser) {
      throw new NotFoundException(EUserErrorMessage.USER_NOT_FOUND);
    }

    if (
      getUser.accounts[0].password !==
      this.encryptionHelper.encryptForPassword(userData.nowPassword)
    ) {
      throw new BadRequestException(
        EUserAuthErrorMessage.USER_AUTH_BAD_REQUEST_PASSWORD,
      );
    }

    return getUser;
  }

  /**
   * 유저 아이디, 이름 및 전화전호 조회
   * @param uid
   * @param name
   * @param phoneNumber
   */
  async getUserByUidAndNameAndPhoneNumber(
    uid: string,
    name: string,
    phoneNumber: string,
  ): Promise<User> {
    const getUser = await this.userRepository.findOne({
      where: {
        accounts: {
          uid: uid,
        },
        name: name,
        phoneNumber: phoneNumber,
      },
      relations: {
        accounts: true,
      },
    });

    if (!getUser) {
      throw new NotFoundException(EUserErrorMessage.USER_NOT_FOUND_MATCHING);
    }

    getUser.accounts = getUser.accounts.map((x) => {
      delete x.password;
      delete x.refreshToken;
      return x;
    });

    return getUser;
  }

  /**
   * 유저 이름 및 전화전호 조회
   * @param name
   * @param phoneNumber
   */
  async getUserByNameAndPhoneNumber(
    name: string,
    phoneNumber: string,
  ): Promise<User> {
    const getUser = await this.userRepository.findOne({
      where: {
        name: name,
        phoneNumber: phoneNumber,
      },
      relations: ['accounts'],
    });

    if (!getUser) {
      throw new NotFoundException(EUserErrorMessage.USER_NOT_FOUND_MATCHING);
    }

    getUser.accounts = getUser.accounts.map((x) => {
      delete x.password;
      delete x.refreshToken;
      return x;
    });

    return getUser;
  }

  /**
   * 유저 아이디 업데이트
   * @param id
   * @param userData
   */
  async updateUserById(
    id: number,
    userData: {
      name?: string;
      displayName?: string;
      phoneNumber?: string;
      birthday?: Date;
      address?: string;
      zipCode?: string;
      detailAddress?: string;
      status?: EUserStatus;
      role?: EUserRole;
    },
  ): Promise<User> {
    await this.getUserById(id);

    await this.userRepository.update(id, userData);

    return this.getUserById(id);
  }

  /**
   * 유저 삭제
   * @param id
   */
  async deleteUserById(id: number): Promise<User> {
    const user = await this.getUserById(id);

    if (!user) {
      throw new NotFoundException(EUserErrorMessage.USER_NOT_FOUND);
    }

    /** 유저 status 변경 */
    await this.userRepository.update(user.id, {
      status: EUserStatus.DELETED,
    });
    await this.userAccountRepository.update(
      { userId: user.id },
      {
        status: EUserAccountStatus.DELETED,
      },
    );

    /** 유저 삭제 */
    await this.userRepository.softDelete({
      id: id,
    });

    /** 유저 계정 삭제 */
    await this.userAccountRepository.softDelete({
      userId: id,
    });

    return user;
  }
}
