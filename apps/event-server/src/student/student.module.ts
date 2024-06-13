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
import { StudentService, StudentManagementCardService } from './services';

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
  controllers: [],
  providers: [StudentService, StudentManagementCardService],
  exports: [StudentService, StudentManagementCardService],
})
export class StudentModule {}
