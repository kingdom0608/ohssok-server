import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { generateTypeormModuleOptions } from '@app/common/configs/typeorm.config';
import {
  CommonModule,
  DOMAINS,
  ETeacherStatus,
  Lecture,
  LectureContent,
  Teacher,
} from '@app/common';
import { faker } from '@faker-js/faker';
import { TeacherService } from './teacher.service';

describe('TeacherService', () => {
  const name = faker.internet.userName();
  let teacherService: TeacherService;
  let createTeacher: Teacher;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/test.env',
        }),
        TypeOrmModule.forRootAsync({
          name: DOMAINS.Lecture,
          useFactory: (configService: ConfigService) =>
            generateTypeormModuleOptions(configService, DOMAINS.Lecture),
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature(
          [Lecture, LectureContent, Teacher],
          DOMAINS.Lecture,
        ),
        CommonModule,
      ],
      providers: [TeacherService],
    }).compile();

    teacherService = module.get<TeacherService>(TeacherService);
  });

  afterAll(async () => {
    /** 테스트 유저 삭제 */
  });

  it('강사 생성', async () => {
    const result = await teacherService.createTeacher({
      name: name,
      description: '영어 강사',
    });
    // console.log(result);
    createTeacher = result;
    expect(result.name).toEqual(name);
  });

  it('강사 아이디 조회', async () => {
    const result = await teacherService.getTeacherById(createTeacher.id);
    // console.log(result);
    expect(result.name).toEqual(name);
  });

  it('강사 수정', async () => {
    const result = await teacherService.updateTeacherById(createTeacher.id, {
      status: ETeacherStatus.INACTIVE,
    });
    // console.log(result);
    expect(result.status).toEqual(ETeacherStatus.INACTIVE);
  });

  it('강사 삭제', async () => {
    const result = await teacherService.deleteTeacherById(createTeacher.id);
    // console.log(result);
    expect(result.name).toEqual(name);
  });
});
