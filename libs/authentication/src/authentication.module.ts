import { Module } from '@nestjs/common';
import { AuthenticationStrategy } from '@app/authentication/strategies';
import { AuthenticationGuard } from '@app/authentication/guards';

@Module({
  providers: [AuthenticationStrategy, AuthenticationGuard],
  exports: [AuthenticationStrategy, AuthenticationGuard],
})
export class AuthenticationModule {}
