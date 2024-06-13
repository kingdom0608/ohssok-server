import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationStrategy } from '@app/authentication';
import { CommonModule, isLocal, parsedEnvFile } from '@app/common';
import { AuthenticationController } from './controllers';
import { AuthenticationService } from './services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: parsedEnvFile(),
    }),
    CommonModule,
  ],
  controllers: isLocal() ? [AuthenticationController] : [],
  providers: [AuthenticationService, AuthenticationStrategy],
})
export class AuthenticationModule {}
