import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CommonModule,
  DOMAINS,
  generateTypeormModuleOptions,
  UserCertify,
  EUserCertifyStatus,
} from '@app/common';
import { UserCertifyService } from './user-certify.service';

describe('UserCertifyService', () => {
  const phoneNumber = '01012345678';
  let userCertify: UserCertifyService;
  let createUserCertify: UserCertify;

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
        TypeOrmModule.forFeature([UserCertify], DOMAINS.User),
        CommonModule,
      ],
      providers: [UserCertifyService],
    }).compile();

    userCertify = module.get<UserCertifyService>(UserCertifyService);
  });

  it('createUserCertify', async () => {
    const result = await userCertify.createUserCertify({
      phoneNumber: phoneNumber,
      code: '123456',
    });
    // console.log(result);
    createUserCertify = result;
    expect(result.status).toEqual(EUserCertifyStatus.INACTIVE);
  });

  it('getUserCertifyByPhoneNumber', async () => {
    const result = await userCertify.getUserCertifyByPhoneNumber(
      createUserCertify.phoneNumber,
    );
    // console.log(result);
    expect(result.status).toEqual(EUserCertifyStatus.INACTIVE);
  });

  it('getUserCertifyByPhoneNumber - NotFound', async () => {
    try {
      await userCertify.getUserCertifyByPhoneNumber(
        createUserCertify.phoneNumber,
      );
    } catch (err) {
      expect(err.message).toEqual('인증되지 않은 유저 입니다.');
    }
  });

  it('getActiveUserCertifyByPhoneNumber - NotFound', async () => {
    try {
      await userCertify.getActiveUserCertifyByPhoneNumber(
        createUserCertify.phoneNumber,
      );
    } catch (err) {
      expect(err.message).toEqual('인증되지 않은 유저 입니다.');
    }
  });

  it('updateUserCertifyByPhoneNumber', async () => {
    const result = await userCertify.updateUserCertifyByPhoneNumber(
      createUserCertify.phoneNumber,
      {
        status: EUserCertifyStatus.ACTIVE,
      },
    );
    // console.log(result);
    expect(result.status).toEqual(EUserCertifyStatus.ACTIVE);
  });

  it('deleteUserCertifyByPhoneNumber', async () => {
    const result = await userCertify.deleteUserCertifyByPhoneNumber(
      createUserCertify.phoneNumber,
    );
    // console.log(result);
    expect(result.affected).toBeGreaterThanOrEqual(1);
  });
});
