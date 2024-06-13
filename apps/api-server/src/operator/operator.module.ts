import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  CommonModule,
  DOMAINS,
  generateTypeormModuleOptions,
  parsedEnvFile,
  Notice,
} from '@app/common';
import { AuthenticationStrategy } from '@app/authentication';
import {
  AdminOperatorController,
  PublicOperatorController,
} from './controllers';
import { NoticeService } from './services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: parsedEnvFile(),
    }),
    TypeOrmModule.forRootAsync({
      name: DOMAINS.Notice,
      useFactory: (configService: ConfigService) =>
        generateTypeormModuleOptions(configService, DOMAINS.Notice),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Notice], DOMAINS.Notice),
    CommonModule,
  ],
  controllers: [
    /** public */
    PublicOperatorController,
    /** Admin */
    AdminOperatorController,
  ],
  providers: [NoticeService, AuthenticationStrategy],
})
export class OperatorModule {}
