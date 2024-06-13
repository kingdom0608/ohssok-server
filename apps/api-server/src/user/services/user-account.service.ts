import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DOMAINS,
  EncryptionHelper,
  EUserAccountErrorMessage,
  EUserAccountProvider,
  UserAccount,
} from '@app/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserAccountService {
  constructor(
    @InjectDataSource(DOMAINS.User)
    private dataSource: DataSource,
    @InjectRepository(UserAccount, DOMAINS.User)
    private readonly userAccountRepository: Repository<UserAccount>,
    private readonly encryptionHelper: EncryptionHelper,
  ) {}

  /**
   * 유저 계정 업데이트
   * @param uid
   * @param provider
   * @param userAccountData
   */
  async updateUserAccountByUidProvider(
    uid: string,
    provider: EUserAccountProvider,
    userAccountData: {
      refreshToken?: string;
      password?: string;
    },
  ): Promise<UserAccount> {
    await this.getUserAccountByUidProvider(uid, provider);

    if (userAccountData.password) {
      userAccountData.password = this.encryptionHelper.encryptForPassword(
        userAccountData.password,
      );
    }

    /** 유저 계정 업데이트 */
    await this.userAccountRepository.update(
      {
        uid: uid,
        provider: provider,
      },
      userAccountData,
    );

    return this.getUserAccountByUidProvider(uid, provider);
  }

  /**
   * 유저 계정 uid 제공자 조회
   * @param uid
   * @param provider
   */
  async getUserAccountByUidProvider(
    uid: string,
    provider: EUserAccountProvider,
  ): Promise<UserAccount> {
    const userAccount = await this.userAccountRepository.findOne({
      where: {
        uid: uid,
        provider: provider,
      },
      relations: ['user'],
    });

    if (!userAccount) {
      throw new NotFoundException(
        EUserAccountErrorMessage.USER_ACCOUNT_NOT_FOUND,
      );
    }

    return userAccount;
  }

  /**
   * 유저 계정 uid 조회
   * @param uid
   */
  async getUserAccountByUid(uid: string): Promise<UserAccount> {
    const userAccount = await this.userAccountRepository.findOne({
      where: {
        uid: uid,
      },
    });

    if (!userAccount) {
      throw new NotFoundException(
        EUserAccountErrorMessage.USER_ACCOUNT_NOT_FOUND,
      );
    }

    return userAccount;
  }
}
