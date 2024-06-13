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
import { StudentManagementCardService } from './student-management-card.service';
import { StudentService } from './student.service';
import { StudentManagementCardDetailService } from './student-management-card-detail.service';
import { faker } from '@faker-js/faker';
import { StudentManagementCardDetailHomeworkService } from './student-management-card-detail-homework.service';
import { EStudentManagementCardDetailHomeworkCheck } from '@app/common/enums/student/student-management-card-detail-homework.enum';

describe('StudentManagementCardDetailHomeworkService', () => {
  let studentService: StudentService;
  let studentManagementCardService: StudentManagementCardService;
  let studentManagementCardDetailService: StudentManagementCardDetailService;
  let studentManagementCardDetailHomeworkService: StudentManagementCardDetailHomeworkService;
  //
  let student: Student;
  let card: StudentManagementCard;
  let cardDetail: StudentManagementCardDetail;
  let homework: StudentManagementCardDetailHomework;

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
      providers: [
        StudentService,
        StudentManagementCardService,
        StudentManagementCardDetailService,
        StudentManagementCardDetailHomeworkService,
      ],
    }).compile();

    studentService = module.get<StudentService>(StudentService);
    studentManagementCardService = module.get<StudentManagementCardService>(
      StudentManagementCardService,
    );
    studentManagementCardService = module.get<StudentManagementCardService>(
      StudentManagementCardService,
    );
    studentManagementCardDetailService =
      module.get<StudentManagementCardDetailService>(
        StudentManagementCardDetailService,
      );
    studentManagementCardDetailHomeworkService =
      module.get<StudentManagementCardDetailHomeworkService>(
        StudentManagementCardDetailHomeworkService,
      );
  });

  beforeAll(async () => {
    student = await studentService.createStudent({
      user: {
        id: +faker.random.numeric(5),
        name: '김오쏙',
        birthday: new Date(),
        phoneNumber: '01012341234',
      },
      student: {
        mockExamAverageScore: 100,
        internalExamAverageScore: 0,
        schoolName: '오쏙대',
        grade: EStudentGrade.ELEMENTARY,
        parentPhoneNumber: '01012341234',
      },
    });
    card = await studentManagementCardService.createStudentManagementCard({
      studentId: student.id,
      lectureId: 1,
      lectureName: '중간고사 관리카드',
    });
    cardDetail =
      await studentManagementCardDetailService.createStudentManagementCardDetail(
        {
          studentManagementCardId: card.id,
          week: '1',
        },
      );
  });

  it('createStudentManagementCardDetailHomework', async () => {
    const createHomework =
      await studentManagementCardDetailHomeworkService.createStudentManagementCardDetailHomework(
        {
          studentManagementCardDetailId: cardDetail.id,
          homeworkName: '단어 100개 암기',
          homeworkCheck: EStudentManagementCardDetailHomeworkCheck.INCOMPLETE,
        },
      );

    homework = createHomework;

    expect(createHomework.homeworkName).toBe('단어 100개 암기');
    expect(createHomework.homeworkCheck).toBe(
      EStudentManagementCardDetailHomeworkCheck.INCOMPLETE,
    );
  });

  it('updateStudentManagementCardDetailHomework', async () => {
    const updateHomework =
      await studentManagementCardDetailHomeworkService.updateStudentManagementCardDetailHomework(
        homework.id,
        {
          homeworkCheck: EStudentManagementCardDetailHomeworkCheck.COMPLETE,
        },
      );

    expect(updateHomework.homeworkCheck).toBe(
      EStudentManagementCardDetailHomeworkCheck.COMPLETE,
    );
  });

  it('getStudentManagementCardDetailHomeworkById', async () => {
    const getHomework =
      await studentManagementCardDetailHomeworkService.getStudentManagementCardDetailHomeworkById(
        homework.id,
      );

    expect(getHomework.id).toBe(homework.id);
  });

  it('deleteStudentManagementCardDetailHomework', async () => {
    const deleteHomework =
      await studentManagementCardDetailHomeworkService.deleteStudentManagementCardDetailById(
        homework.id,
      );

    expect(deleteHomework.id).toBe(homework.id);
  });
});
