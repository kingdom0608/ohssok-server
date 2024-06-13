import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';
import {
  AuthenticationStrategy,
  EAuthenticationUserRole,
  ForbiddenException,
} from '@app/authentication';

export const UserRoleGuard = (
  userRoles: EAuthenticationUserRole[],
): Type<CanActivate> => {
  @Injectable()
  class AuthenticationUserRoleGuard implements CanActivate {
    constructor(
      private readonly authenticationStrategy: AuthenticationStrategy,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      /** 권한 조회 */
      const decodeToken = await this.authenticationStrategy.decodeToken(
        request.headers['x-access-token'],
      );

      if (!userRoles.includes(decodeToken.user?.role)) {
        throw new ForbiddenException();
      }

      return true;
    }
  }

  return mixin(AuthenticationUserRoleGuard);
};
