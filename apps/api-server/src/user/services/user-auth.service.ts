import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthenticationStrategy } from '@app/authentication';
import {
  EncryptionHelper,
  EUserAccountErrorMessage,
  EUserAccountProvider,
  EUserAuthErrorMessage,
  EUserCertifyErrorMessage,
  EUserRole,
  User,
} from '@app/common';
import { UserService } from './user.service';
import { UserAccountService } from './user-account.service';
import axios from 'axios';
import * as process from 'process';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userAccountService: UserAccountService,
    private readonly authenticationStrategy: AuthenticationStrategy,
    private readonly encryptionHelper: EncryptionHelper,
  ) {}

  /**
   * 엑세스 토큰 재발급
   * @param userAccountData {
   *   uid: string
   *   provider: EUserAccountProvider
   *   refreshToken: string
   * }
   */
  async reissueAccessToken(userAccountData: {
    uid: string;
    provider: EUserAccountProvider;
    refreshToken: string;
  }) {
    const { uid, provider, refreshToken } = userAccountData;
    const getUserAccount =
      await this.userAccountService.getUserAccountByUidProvider(uid, provider);

    if (refreshToken !== getUserAccount.refreshToken) {
      throw new BadRequestException(
        EUserCertifyErrorMessage.USER_CERTIFY_UNKNOWN,
      );
    }

    /** verify token alive */
    this.authenticationStrategy.decodeToken(refreshToken);

    const issueToken = await this.authenticationStrategy.issueToken({
      id: getUserAccount.user.id,
      name: getUserAccount.user.name,
      displayName: getUserAccount.user.displayName,
      phoneNumber: getUserAccount.user.phoneNumber,
      status: getUserAccount.user.status,
      role: getUserAccount.user.role,
      uid: getUserAccount.uid,
      provider: getUserAccount.provider,
      createDate: getUserAccount.user.createDate,
      updateDate: getUserAccount.user.updateDate,
    });

    /** 리프레시 토큰 업데이트 */
    await this.userAccountService.updateUserAccountByUidProvider(
      uid,
      provider,
      {
        refreshToken: issueToken.refreshToken,
      },
    );

    return {
      ...getUserAccount,
      accessToken: issueToken.accessToken,
    };
  }

  /**
   * 로그인
   * @param signInData
   * @returns {string} accessToken
   */
  async signIn(signInData: {
    uid: string;
    provider: EUserAccountProvider;
    password?: string;
  }) {
    const { uid, provider, password } = signInData;
    let getUserAccount;
    try {
      getUserAccount =
        await this.userAccountService.getUserAccountByUidProvider(
          uid,
          provider,
        );
    } catch (e) {
      throw new NotFoundException(
        EUserAccountErrorMessage.USER_ACCOUNT_NOT_FOUND_SIGN_IN,
      );
    }

    /** 비밀번호 검증 */
    if (EUserAccountProvider.BASIC) {
      if (
        this.encryptionHelper.encryptForPassword(password) !==
        getUserAccount.password
      ) {
        throw new BadRequestException(
          EUserAuthErrorMessage.USER_AUTH_BAD_REQUEST_PASSWORD,
        );
      }
    }

    /** 토큰 할당 */
    const { accessToken, refreshToken } =
      await this.authenticationStrategy.issueToken({
        id: getUserAccount.user.id,
        name: getUserAccount.user.name,
        displayName: getUserAccount.user.displayName,
        phoneNumber: getUserAccount.user.phoneNumber,
        status: getUserAccount.user.status,
        role: getUserAccount.user.role,
        uid: getUserAccount.uid,
        provider: getUserAccount.provider,
        createDate: getUserAccount.user.createDate,
        updateDate: getUserAccount.user.updateDate,
      });

    /** 리프레시 토큰 업데이트 */
    await this.userAccountService.updateUserAccountByUidProvider(
      uid,
      provider,
      {
        refreshToken: refreshToken,
      },
    );

    delete getUserAccount.password;

    return {
      ...getUserAccount,
      accessToken,
      refreshToken,
    };
  }

  /**
   * 어드민 로그인
   * @param signInData
   */
  async signInForAdmin(signInData: {
    uid: string;
    provider: EUserAccountProvider;
    password?: string;
  }) {
    const { uid, provider, password } = signInData;
    const getUserAccount =
      await this.userAccountService.getUserAccountByUidProvider(uid, provider);

    /** 비밀번호 검증 */
    if (EUserAccountProvider.BASIC) {
      if (
        this.encryptionHelper.encryptForPassword(password) !==
        getUserAccount.password
      ) {
        throw new BadRequestException(
          EUserAuthErrorMessage.USER_AUTH_BAD_REQUEST_PASSWORD,
        );
      }
    }

    /** 관리자 권한 검증 */
    if (
      !(
        getUserAccount.user.role == EUserRole.ADMIN ||
        getUserAccount.user.role == EUserRole.OWNER ||
        getUserAccount.user.role == EUserRole.TEACHER
      )
    ) {
      throw new BadRequestException(EUserAuthErrorMessage.USER_FORBIDDEN_ADMIN);
    }

    /** 토큰 할당 */
    const { accessToken, refreshToken } =
      await this.authenticationStrategy.issueToken({
        id: getUserAccount.user.id,
        name: getUserAccount.user.name,
        displayName: getUserAccount.user.displayName,
        phoneNumber: getUserAccount.user.phoneNumber,
        status: getUserAccount.user.status,
        role: getUserAccount.user.role,
        uid: getUserAccount.uid,
        provider: getUserAccount.provider,
        createDate: getUserAccount.user.createDate,
        updateDate: getUserAccount.user.updateDate,
      });

    /** 리프레시 토큰 업데이트 */
    await this.userAccountService.updateUserAccountByUidProvider(
      uid,
      provider,
      {
        refreshToken: refreshToken,
      },
    );

    delete getUserAccount.password;

    return {
      ...getUserAccount,
      accessToken,
      refreshToken,
    };
  }

  /**
   * 카카오 회원가입
   * @param code
   */
  async signUpForKakao(code: string) {
    let tokenResponse;
    try {
      tokenResponse = await axios.post(
        process.env.KAKAO_TOKEN_URL,
        {
          grant_type: 'authorization_code',
          client_id: process.env.AUTHENTICATION_KAKAO_API_KEY,
          redirect_url: process.env.KAKAO_REDIRECT_URL_FOR_SIGNUP,
          code: code,
        },
        {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );
    } catch (error) {
      throw new BadRequestException(
        EUserAuthErrorMessage.USER_AUTH_BAD_REQUEST_CODE,
      );
    }
    return tokenResponse.data.access_token;
  }

  /**
   * 카카오 로그인
   * @param code
   */
  async signInForKakao(code: string) {
    let tokenResponse;
    try {
      tokenResponse = await axios.post(
        process.env.KAKAO_TOKEN_URL,
        {
          grant_type: 'authorization_code',
          client_id: process.env.AUTHENTICATION_KAKAO_API_KEY,
          redirect_url: process.env.KAKAO_REDIRECT_URL_FOR_SIGNIN,
          code: code,
        },
        {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );
    } catch (error) {
      throw new BadRequestException(
        EUserAuthErrorMessage.USER_AUTH_BAD_REQUEST_CODE,
      );
    }
    return tokenResponse.data.access_token;
  }

  async getUserInfoFromKakao(accessToken: string) {
    let userResponse;
    try {
      userResponse = await axios.get(process.env.KAKAO_PROFILE_URL, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: 'Bearer ' + accessToken,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        EUserAuthErrorMessage.USER_AUTH_BAD_REQUEST_ACCESS_TOKEN,
      );
    }

    return {
      email: userResponse.data.kakao_account.email,
    };
  }

  /**
   * 회원 탈퇴
   */
  async resign(signInData: {
    uid: string;
    provider: EUserAccountProvider;
    password: string;
  }): Promise<User> {
    const { uid, provider, password } = signInData;
    const getUserAccount =
      await this.userAccountService.getUserAccountByUidProvider(uid, provider);

    /** 비밀번호 검증 */
    if (
      this.encryptionHelper.encryptForPassword(password) !==
      getUserAccount.password
    ) {
      throw new BadRequestException(
        EUserAuthErrorMessage.USER_AUTH_BAD_REQUEST_PASSWORD,
      );
    }

    return await this.userService.deleteUserById(getUserAccount.userId);
  }
}
