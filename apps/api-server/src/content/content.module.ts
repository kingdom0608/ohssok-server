import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  CommonModule,
  DOMAINS,
  generateTypeormModuleOptions,
  Image,
  parsedEnvFile,
  Video,
} from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationStrategy } from '@app/authentication';
import { VideoService } from './services';
import { AdminVideoController } from './controllers';
import { PublicImageController, PublicVideoController } from './controllers';
import {
  InternalImageController,
  InternalVideoController,
} from './controllers';
import { AdminImageController } from './controllers';
import { ImageService } from './services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: parsedEnvFile(),
    }),
    TypeOrmModule.forRootAsync({
      name: DOMAINS.Content,
      useFactory: (configService: ConfigService) =>
        generateTypeormModuleOptions(configService, DOMAINS.Content),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Video, Image], DOMAINS.Content),
    CommonModule,
  ],
  controllers: [
    /** public */
    PublicVideoController,
    PublicImageController,
    /** Admin */
    AdminVideoController,
    AdminImageController,
    /** Internal */
    InternalVideoController,
    InternalImageController,
  ],
  providers: [VideoService, ImageService, AuthenticationStrategy],
})
export class ContentModule {}
