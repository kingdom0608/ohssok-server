import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  Banner,
  Slot,
  CommonModule,
  DOMAINS,
  generateTypeormModuleOptions,
  parsedEnvFile,
} from '@app/common';
import { AuthenticationStrategy } from '@app/authentication';
import {
  AdminBannerController,
  AdminSlotController,
  PublicSlotController,
} from './controllers';
import { BannerService, SlotService } from './services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: parsedEnvFile(),
    }),
    TypeOrmModule.forRootAsync({
      name: DOMAINS.Display,
      useFactory: (configService: ConfigService) =>
        generateTypeormModuleOptions(configService, DOMAINS.Display),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Banner, Slot], DOMAINS.Display),
    CommonModule,
  ],
  controllers: [
    /** public */
    PublicSlotController,
    /** Admin */
    AdminBannerController,
    AdminSlotController,
  ],
  providers: [BannerService, SlotService, AuthenticationStrategy],
})
export class DisplayModule {}
