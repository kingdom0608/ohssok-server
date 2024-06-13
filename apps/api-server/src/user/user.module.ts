import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationStrategy } from '@app/authentication';
import {
  CommonModule,
  Condition,
  DOMAINS,
  generateTypeormModuleOptions,
  parsedEnvFile,
  SmsNotification,
  User,
  UserAccount,
  UserCertify,
  UserConditionRelation,
  UserDevice,
  UserRelation,
} from '@app/common';
import {
  PublicUserController,
  AdminUserController,
  PublicUserCertifyController,
  PublicConditionController,
  AdminConditionController,
  PublicUserAccountController,
} from './controllers';
import {
  UserAuthService,
  UserCertifyService,
  UserAccountService,
  UserService,
  ConditionService,
} from './services';
import { InternalUserController } from './controllers/internal';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: parsedEnvFile(),
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
        UserDevice,
        UserAccount,
        UserCertify,
        UserRelation,
        UserConditionRelation,
        Condition,
      ],
      DOMAINS.User,
    ),
    CommonModule,
  ],
  controllers: [
    /** public */
    PublicUserController,
    PublicUserAccountController,
    PublicUserCertifyController,
    PublicConditionController,
    /** Admin */
    AdminUserController,
    AdminConditionController,
    /** Internal */
    InternalUserController,
  ],
  providers: [
    AuthenticationStrategy,
    SmsNotification,
    UserService,
    UserAccountService,
    UserAuthService,
    UserCertifyService,
    ConditionService,
  ],
})
export class UserModule {}
