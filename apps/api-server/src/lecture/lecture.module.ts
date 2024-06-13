import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  Category,
  CommonModule,
  DOMAINS,
  generateTypeormModuleOptions,
  Lecture,
  LectureContent,
  LectureTag,
  parsedEnvFile,
  Teacher,
  UpperCategory,
} from '@app/common';
import {
  AdminLectureContentController,
  AdminLectureController,
  AdminTeacherController,
  AdminTextbookController,
  PublicLectureContentController,
  PublicLectureController,
  PublicTextbookController,
  PublicUpperCategoryController,
} from './controllers';
import { AuthenticationStrategy } from '@app/authentication';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  LectureContentService,
  LectureService,
  TeacherService,
  TextbookService,
  UpperCategoryService,
} from './services';
import { Textbook } from '@app/common/entities/lecture/textbook.entity';
import { LectureThumbnail } from '@app/common/entities/lecture/lecture-thumbnail.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: parsedEnvFile(),
    }),
    TypeOrmModule.forRootAsync({
      name: DOMAINS.Lecture,
      useFactory: (configService: ConfigService) =>
        generateTypeormModuleOptions(configService, DOMAINS.Lecture),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(
      [
        Lecture,
        LectureThumbnail,
        LectureContent,
        LectureTag,
        Textbook,
        Teacher,
        Category,
        UpperCategory,
      ],
      DOMAINS.Lecture,
    ),
    CommonModule,
  ],
  controllers: [
    /** admin */
    AdminLectureController,
    AdminLectureContentController,
    AdminTeacherController,
    AdminTextbookController,
    /** public */
    PublicLectureController,
    PublicLectureContentController,
    PublicUpperCategoryController,
    PublicTextbookController,
  ],
  providers: [
    AuthenticationStrategy,
    LectureService,
    LectureContentService,
    TeacherService,
    TextbookService,
    UpperCategoryService,
  ],
})
export class LectureModule {}
