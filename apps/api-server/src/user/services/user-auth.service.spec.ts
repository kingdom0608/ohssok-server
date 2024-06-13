import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationStrategy } from '@app/authentication';
import {
  CommonModule,
  Condition,
  DOMAINS,
  EncryptionHelper,
  EUserAccountProvider,
  EUserAuthErrorMessage,
  EUserCertifyErrorMessage,
  EUserRole,
  EUserStatus,
  generateTypeormModuleOptions,
  User,
  UserAccount,
  UserConditionRelation,
  UserDevice,
  UserRelation,
} from '@app/common';
import { UserAccountService } from './user-account.service';
import { UserAuthService } from './user-auth.service';
import { UserService } from './user.service';
import { faker } from '@faker-js/faker';
import axios from 'axios';
import { BadRequestException } from '@nestjs/common';
import * as process from 'process';
jest.mock('axios');

const mockUid = 'test1234';
const mockAdminUid = 'admin1234';
const mockPassword = 'abc1234';
const mockUserData = {
  id: 1,
  name: 'name',
  displayName: 'displayName',
  phoneNumber: '01043269114',
  birthday: new Date(),
  address: faker.address.streetAddress(),
  status: EUserStatus.ACTIVE,
  role: EUserRole.STUDENT,
  uid: 'test1234',
  provider: EUserAccountProvider.BASIC,
  createDate: new Date(),
  updateDate: new Date(),
};

const mockUserAccountData = {
  userId: mockUserData.id,
  password: '',
  uid: 'test1234',
  provider: EUserAccountProvider.BASIC,
  refreshToken: '',
  user: mockUserData,
};

const mockAdminData = {
  id: 2,
  name: 'admin',
  displayName: 'displayAdmin',
  phoneNumber: '01025980387',
  status: EUserStatus.ACTIVE,
  role: EUserRole.ADMIN,
  uid: 'admin1234',
  provider: EUserAccountProvider.BASIC,
  createDate: new Date(),
  updateDate: new Date(),
};

const mockAdminAccountData = {
  userId: mockUserData.id,
  password: '',
  uid: 'admin1234',
  provider: EUserAccountProvider.BASIC,
  refreshToken: '',
  user: mockAdminData,
};

describe('user account service', () => {
  let authService: UserAuthService;
  let userAccountService: UserAccountService;
  let userService: UserService;
  let authenticationStrategy: AuthenticationStrategy;
  const birthday = new Date();
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
      providers: [
        UserAccountService,
        UserAuthService,
        UserService,
        AuthenticationStrategy,
      ],
    }).compile();

    authService = module.get<UserAuthService>(UserAuthService);
    userService = module.get<UserService>(UserService);
    userAccountService = module.get<UserAccountService>(UserAccountService);
    authenticationStrategy = module.get<AuthenticationStrategy>(
      AuthenticationStrategy,
    );
  });

  describe('signIn', () => {
    it('패스워드 불일치', async () => {
      jest
        .spyOn(userAccountService, 'getUserAccountByUidProvider')
        .mockResolvedValueOnce({
          uid: mockUid,
          password: 'wrong',
        } as any);
      try {
        await authService.signIn({
          uid: 'test1234',
          password: '1234',
          provider: EUserAccountProvider.BASIC,
        });
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

    it('정상 로그인 확인', async () => {
      const encryptionHelper = new EncryptionHelper();

      mockUserAccountData.password =
        encryptionHelper.encryptForPassword(mockPassword);
      jest
        .spyOn(userAccountService, 'getUserAccountByUidProvider')
        .mockResolvedValueOnce(mockUserAccountData as any);
      const updateUserAccount = jest
        .spyOn(userAccountService, 'updateUserAccountByUidProvider')
        .mockResolvedValueOnce(mockUserAccountData as any);

      const result = await authService.signIn({
        uid: mockUid,
        password: mockPassword,
        provider: EUserAccountProvider.BASIC,
      });

      expect(result.uid).toBe(mockUid);
      expect(typeof result.accessToken).toBe('string');
      expect(typeof result.refreshToken).toBe('string');
      expect(updateUserAccount).toBeCalledWith(
        mockUid,
        EUserAccountProvider.BASIC,
        {
          refreshToken: result.refreshToken,
        },
      );
    });
  });

  describe('adminSignIn', () => {
    it('어드민 패스워드 불일치', async () => {
      jest
        .spyOn(userAccountService, 'getUserAccountByUidProvider')
        .mockResolvedValueOnce({
          uid: mockAdminUid,
          password: 'wrong',
        } as any);
      try {
        await authService.signIn({
          uid: 'admin1234',
          password: '1234',
          provider: EUserAccountProvider.BASIC,
        });
      } catch (e) {
        expect(e.message).toEqual(
          EUserAuthErrorMessage.USER_AUTH_BAD_REQUEST_PASSWORD,
        );
      }
    });

    it('어드민 권한 불일치', async () => {
      const encryptionHelper = new EncryptionHelper();

      mockUserAccountData.password =
        encryptionHelper.encryptForPassword(mockPassword);
      jest
        .spyOn(userAccountService, 'getUserAccountByUidProvider')
        .mockResolvedValueOnce(mockUserAccountData as any);

      try {
        await authService.signInForAdmin({
          uid: mockUid,
          password: mockPassword,
          provider: EUserAccountProvider.BASIC,
        });
      } catch (e) {
        expect(e.message).toEqual(EUserAuthErrorMessage.USER_FORBIDDEN_ADMIN);
      }
    });

    it('어드민 정상 로그인 확인', async () => {
      const encryptionHelper = new EncryptionHelper();

      mockAdminAccountData.password =
        encryptionHelper.encryptForPassword(mockPassword);
      jest
        .spyOn(userAccountService, 'getUserAccountByUidProvider')
        .mockResolvedValueOnce(mockAdminAccountData as any);
      const updateAdminAccount = jest
        .spyOn(userAccountService, 'updateUserAccountByUidProvider')
        .mockResolvedValueOnce(mockAdminAccountData as any);

      const result = await authService.signInForAdmin({
        uid: mockAdminUid,
        password: mockPassword,
        provider: EUserAccountProvider.BASIC,
      });

      expect(result.uid).toBe(mockAdminUid);
      expect(typeof result.accessToken).toBe('string');
      expect(typeof result.refreshToken).toBe('string');
      expect(updateAdminAccount).toBeCalledWith(
        mockAdminUid,
        EUserAccountProvider.BASIC,
        {
          refreshToken: result.refreshToken,
        },
      );
    });
  });

  describe('refreshAccessToken', () => {
    it('엑세스 토큰 정상 발급 확인', async () => {
      const tokenData = await authenticationStrategy.issueToken(mockUserData);
      mockUserAccountData.refreshToken = tokenData.refreshToken;

      jest
        .spyOn(userAccountService, 'getUserAccountByUidProvider')
        .mockResolvedValue(mockUserAccountData as any);

      const result = await authService.reissueAccessToken(mockUserAccountData);
      const decodedToken = authenticationStrategy.decodeToken(
        result.accessToken,
      );

      expect(decodedToken.user.id).toBe(mockUserData.id);
    });

    it('유효하지 않은 엑세스 토큰 정상 에러 확인', async () => {
      const refreshToken = 'dummy';

      const userAccountData = {
        uid: 'test1234',
        provider: EUserAccountProvider.KAKAO,
        refreshToken: refreshToken,
      };

      jest
        .spyOn(userAccountService, 'getUserAccountByUidProvider')
        .mockResolvedValueOnce({
          ...userAccountData,
          refreshToken: null,
        } as any);

      try {
        await authService.reissueAccessToken(userAccountData);
      } catch (err) {
        expect(err.message).toEqual(
          EUserCertifyErrorMessage.USER_CERTIFY_UNKNOWN,
        );
      }
    });
  });
  describe('kakaoAPI 회원가입, 로그인 테스트', () => {
    const mockTokenResponse = {
      data: {
        access_token: 'access_token',
      },
    };
    const mockUserResponse = {
      data: {
        kakao_account: {
          email: 'testUser@example.com',
        },
      },
    };
    const mockAxios = axios as jest.Mocked<typeof axios>;
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('signUpForKakao', async () => {
      const code = 'right code';
      mockAxios.post.mockResolvedValueOnce(mockTokenResponse);
      const token = await authService.signUpForKakao(code);
      expect(mockAxios.post).toHaveBeenCalledWith(
        process.env.KAKAO_TOKEN_URL,
        expect.objectContaining({
          grant_type: 'authorization_code',
          client_id: process.env.AUTHENTICATION_KAKAO_API_KEY,
          redirect_url: process.env.KAKAO_REDIRECT_URL_FOR_SIGNUP,
          code: code,
        }),
        expect.any(Object),
      );
      expect(token).toEqual(mockTokenResponse.data.access_token);
    });

    it('signInForKakao', async () => {
      const code = 'right code';
      mockAxios.post.mockResolvedValueOnce(mockTokenResponse);
      const token = await authService.signInForKakao(code);
      expect(mockAxios.post).toHaveBeenCalledWith(
        process.env.KAKAO_TOKEN_URL,
        expect.objectContaining({
          grant_type: 'authorization_code',
          client_id: process.env.AUTHENTICATION_KAKAO_API_KEY,
          redirect_url: process.env.KAKAO_REDIRECT_URL_FOR_SIGNIN,
          code: code,
        }),
        expect.any(Object),
      );
      expect(token).toEqual(mockTokenResponse.data.access_token);
    });

    it('유효하지 않은 인가코드 에러 확인', async () => {
      const code = 'wrong code';
      mockAxios.post.mockRejectedValueOnce(new Error('failed'));
      await expect(authService.signUpForKakao(code)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('getUserResponse', async () => {
      const mockToken = 'right_token';
      mockAxios.get.mockResolvedValueOnce(mockUserResponse);

      const userResponse = await authService.getUserInfoFromKakao(mockToken);
      expect(mockAxios.get).toHaveBeenCalledWith(
        process.env.KAKAO_PROFILE_URL,
        expect.any(Object),
      );
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: 'Bearer ' + mockToken,
        },
      });
      expect(userResponse).toEqual(mockUserResponse.data.kakao_account);
    });

    it('유효하지 않은 액세스 토큰 에러 확인', async () => {
      const mockToken = 'wrong_token';
      mockAxios.get.mockRejectedValueOnce(new Error('failed'));
      await expect(authService.getUserInfoFromKakao(mockToken)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('resign', () => {
    let deleteUser;
    const name = faker.internet.userName();
    const number = faker.random.numeric(3);
    beforeAll(async () => {
      delete mockUserData.id;
      deleteUser = await userService.createUser({
        displayName: '',
        name: '',
        birthday: birthday,
        address: address,
        role: EUserRole.STUDENT,
        zipCode: number,
        detailAddress: detailAddress,
        phoneNumber: faker.phone.number(),
        accounts: [
          {
            provider: EUserAccountProvider.BASIC,
            uid: name + number,
            password: mockPassword,
          },
        ],
        conditionRelations: [
          {
            conditionId: 1,
          },
        ],
      });
    });
    afterAll(async () => await userService.deleteUserById(deleteUser.id));

    it('회원 탈퇴 테스트', async () => {
      await authService.resign({
        uid: deleteUser.uid,
        provider: EUserAccountProvider.BASIC,
        password: mockPassword,
      });
    });
  });
});
