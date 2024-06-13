import { Injectable } from '@nestjs/common';
import { AuthenticationStrategy } from '@app/authentication';
import { EUserAccountProvider, EUserRole, EUserStatus } from '@app/common';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly authenticationStrategy: AuthenticationStrategy,
  ) {}

  /** 토큰 발행 */
  async issueToken(issueTokenData: { role: EUserRole }) {
    const { accessToken, refreshToken } =
      await this.authenticationStrategy.issueToken({
        id: 0,
        name: '오쏙',
        displayName: '오쏙',
        phoneNumber: '01055935009',
        status: EUserStatus.ACTIVE,
        role: issueTokenData.role,
        uid: 'admin1234',
        provider: EUserAccountProvider.BASIC,
        createDate: new Date(),
        updateDate: new Date(),
      });

    return {
      accessToken,
      refreshToken,
    };
  }
}
