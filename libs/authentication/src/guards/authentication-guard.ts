import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticationStrategy } from '@app/authentication/strategies';
import { EUserStatus } from '@app/common';
import { ForbiddenException } from '@app/authentication/exceptions';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly authenticationStrategy: AuthenticationStrategy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    /** 권한 조회 */
    const decodeToken = await this.authenticationStrategy.decodeToken(
      request.headers['x-access-token'],
    );

    /** 헤더에 유저 아이디 입력 */
    request.user = decodeToken.user;

    /** 활성화 유저 제외 예외처리 */
    if (request.user.status !== EUserStatus.ACTIVE) {
      throw new ForbiddenException();
    }

    return true;
  }
}
