import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CommonModule,
  DOMAINS,
  EStudentGrade,
  generateTypeormModuleOptions,
} from '@app/common';
import {
  Student,
  StudentManagementCard,
  StudentManagementCardDetail,
  StudentManagementCardDetailHomework,
} from '@app/common/entities/student';
import { StudentService } from './student.service';

describe('StudentManagementCardService', () => {
  let studentService: StudentService;
  let student: Student;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/local.env',
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
      providers: [StudentService],
    }).compile();

    studentService = module.get<StudentService>(StudentService);
  });

  it('createStudent', async () => {
    const result = await studentService.createStudent({
      user: {
        id: 1,
        name: '김오쏙',
        phoneNumber: '01012341234',
        birthday: new Date(),
      },
      student: {
        schoolName: '오쏙대',
        parentPhoneNumber: '01043214321',
        grade: EStudentGrade.ELEMENTARY,
        internalExamAverageScore: 0,
        mockExamAverageScore: 100,
      },
    });
    student = result;
    // console.log(result);
    expect(result.name).toBe('김오쏙');
  });

  it('list', async () => {
    const result = await studentService.listStudent({});
    // console.log(result);
    expect(result.list.length).toBeGreaterThan(0);
  });

  it('getStudent', async () => {
    const result = await studentService.getStudentById(student.id);
    // console.log(result);
    expect(result.id).toBe(result.id);
  });
});
