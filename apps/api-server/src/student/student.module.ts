import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  CommonModule,
  DOMAINS,
  generateTypeormModuleOptions,
  parsedEnvFile,
} from '@app/common';
import {
  Student,
  StudentManagementCard,
  StudentManagementCardDetail,
  StudentManagementCardDetailHomework,
} from '@app/common/entities/student';
import { AuthenticationStrategy } from '@app/authentication';
import {
  StudentManagementCardDetailHomeworkService,
  StudentManagementCardDetailService,
  StudentManagementCardService,
  StudentService,
} from './services';
import {
  AdminStudentController,
  AdminStudentManagementCardController,
  AdminStudentManagementCardDetailController,
  PublicStudentManagementCardController,
  PublicStudentManagementCardDetailController,
} from './controller';
import { InternalStudentController } from './controller/internal';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: parsedEnvFile(),
    }),
    TypeOrmModule.forRootAsync({
      name: DOMAINS.Student,
      useFactory: (configService: ConfigService) =>
        generateTypeormModuleOptions(configService, DOMAINS.Student),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(
      [
        Student,
        StudentManagementCard,
        StudentManagementCardDetail,
        StudentManagementCardDetailHomework,
      ],
      DOMAINS.Student,
    ),
    CommonModule,
  ],
  controllers: [
    AdminStudentController,
    AdminStudentManagementCardController,
    AdminStudentManagementCardDetailController,
    PublicStudentManagementCardController,
    PublicStudentManagementCardDetailController,
    InternalStudentController,
  ],
  providers: [
    StudentService,
    StudentManagementCardService,
    StudentManagementCardDetailService,
    StudentManagementCardDetailHomeworkService,
    AuthenticationStrategy,
  ],
})
export class StudentModule {}
