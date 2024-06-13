import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { generateTypeormModuleOptions } from '@app/common/configs/typeorm.config';
import {
  CommonModule,
  Condition,
  DOMAINS,
  EUserAccountErrorMessage,
  EUserAccountProvider,
  EUserRole,
  User,
  UserAccount,
  UserConditionRelation,
  UserDevice,
  UserRelation,
} from '@app/common';
import { faker } from '@faker-js/faker';
import { UserService } from './user.service';

describe('UserService', () => {
  const name = faker.internet.userName();
  const uidName = faker.name.firstName();
  const number = faker.random.numeric(3);
  const uid = uidName + number;
  const password = faker.internet.password();
  const phoneNumber = faker.phone.number();
  const birthday = new Date();
  const address = faker.address.streetAddress();
  const zipCode = faker.address.zipCode();
  const detailAddress = faker.address.secondaryAddress();
  let userService: UserService;
  let createUser;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/test.env',
        }),
        TypeOrmModule.forRootAsync({
          name: DOMAINS.User,
          useFactory: (configService: ConfigService) =>
            generateTypeormModuleOptions(configService, DOMAINS.User),
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature(
          [
            User,
            UserAccount,
            UserDevice,
            UserRelation,
            Condition,
            UserConditionRelation,
          ],
          DOMAINS.User,
        ),
        CommonModule,
      ],
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterAll(async () => {
    /** 테스트 유저 삭제 */
    await userService.deleteUserById(createUser.id);
  });

  it('유저 생성', async () => {
    const result = await userService.createUser({
      name: name,
      displayName: name,
      phoneNumber: phoneNumber,
      birthday: birthday,
      address: address,
      zipCode: zipCode,
      detailAddress: detailAddress,
      role: EUserRole.STUDENT,
      accounts: [
        {
          uid: 'test1234',
          password: '123123',
          provider: EUserAccountProvider.BASIC,
        },
      ],
      conditionRelations: [
        {
          conditionId: 1,
        },
      ],
    });
    // console.log(result);
    createUser = result;
    expect(result.name).toEqual(name);
  });

  it('유저 계정만 생성', async () => {
    const result = await userService.createUser({
      name: name,
      displayName: name,
      phoneNumber: phoneNumber,
      birthday: birthday,
      address: address,
      zipCode: zipCode,
      detailAddress: detailAddress,
      role: EUserRole.STUDENT,
      accounts: [
        {
          uid: uid,
          password: password,
          provider: EUserAccountProvider.KAKAO,
        },
      ],
      conditionRelations: [
        {
          conditionId: 1,
        },
      ],
    });
    // console.log(result);
    createUser = result;
    expect(result.name).toEqual(name);
  });

  it('유저 계정만 생성 - 중복 유저 계정', async () => {
    try {
      await userService.createUser({
        name: name,
        displayName: name,
        phoneNumber: phoneNumber,
        birthday: birthday,
        address: address,
        zipCode: zipCode,
        detailAddress: detailAddress,
        role: EUserRole.STUDENT,
        accounts: [
          {
            uid: uid,
            password: password,
            provider: EUserAccountProvider.KAKAO,
          },
        ],
        conditionRelations: [
          {
            conditionId: 1,
          },
        ],
      });
    } catch (err) {
      expect(err.message).toEqual(
        EUserAccountErrorMessage.USER_ACCOUNT_CONFLICT,
      );
    }
  });

  it('listUser', async () => {
    const result = await userService.listUser({
      phoneNumber: phoneNumber,
    });
    // console.log(result);
    expect(result).toHaveProperty('list');
    expect(result).toHaveProperty('pagination');
  });

  describe('updateUser', () => {
    it('updateUserById', async () => {
      const result = await userService.updateUserById(createUser.id, {
        role: EUserRole.ADMIN,
      });
      // console.log(createUser);
      expect(result.role).toBe(EUserRole.ADMIN);
    });
  });

  describe('getUser', () => {
    it('getUserByNameAndPhoneNumber', async () => {
      const result = await userService.getUserByNameAndPhoneNumber(
        name,
        phoneNumber,
      );
      // console.log(createUser);
      expect(result.phoneNumber).toBe(phoneNumber);
    });
  });
});
