import { Test, TestingModule } from '@nestjs/testing';
import {
  CommonModule,
  Condition,
  DOMAINS,
  EUserAccountProvider,
  EUserRole,
  generateTypeormModuleOptions,
  User,
  UserAccount,
  UserConditionRelation,
  UserDevice,
  UserRelation,
} from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { UserService } from './user.service';
import { UserAccountService } from './user-account.service';

describe('UserAccountService', () => {
  let userService: UserService;
  let userAccountService: UserAccountService;
  let createUser: User;
  const name = faker.internet.userName();
  const phoneNumber = faker.phone.number();
  const uidName = faker.name.firstName();
  const number = faker.random.numeric(3);
  const uid = uidName + number;
  const password = faker.phone.number();
  const birthday = new Date();
  const zipCode = faker.random.numeric(3);
  const address = faker.address.streetAddress();
  const detailAddress = faker.address.streetAddress();

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
      providers: [UserService, UserAccountService],
    }).compile();

    userService = module.get<UserService>(UserService);
    userAccountService = module.get<UserAccountService>(UserAccountService);

    /** 유저 생성 */
    createUser = await userService.createUser({
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
          provider: EUserAccountProvider.BASIC,
        },
      ],
      conditionRelations: [
        {
          conditionId: 1,
        },
      ],
    });
  });

  afterAll(async () => {
    /** 테스트 유저 삭제 */
    await userService.deleteUserById(createUser.id);
  });

  it('updateUserAccount', async () => {
    const result = await userAccountService.updateUserAccountByUidProvider(
      uid,
      EUserAccountProvider.BASIC,
      {
        refreshToken: 'refreshToken',
      },
    );
    // console.log(result);
    expect(result.refreshToken).toEqual('refreshToken');
  });

  it('getUserAccountByUidProvider', async () => {
    const result = await userAccountService.getUserAccountByUidProvider(
      uid,
      EUserAccountProvider.BASIC,
    );
    // console.log(result);
    expect(result.uid).toEqual(uid);
  });
});
