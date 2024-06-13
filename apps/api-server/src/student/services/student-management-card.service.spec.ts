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
import { faker } from '@faker-js/faker';
import { StudentManagementCardService } from './student-management-card.service';
import { StudentService } from './student.service';

describe('StudentManagementCardService', () => {
  let studentManagementCardService: StudentManagementCardService;
  let studentService: StudentService;
  //
  let card: StudentManagementCard;
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
      providers: [StudentService, StudentManagementCardService],
    }).compile();

    studentManagementCardService = module.get<StudentManagementCardService>(
      StudentManagementCardService,
    );
    studentService = module.get<StudentService>(StudentService);
  });

  beforeAll(async () => {
    student = await studentService.createStudent({
      user: {
        id: +faker.random.numeric(5),
        name: '김오쏙',
        phoneNumber: '01012341234',
        birthday: new Date(),
      },
      student: {
        parentPhoneNumber: '01012341234',
        grade: EStudentGrade.ELEMENTARY,
        internalExamAverageScore: 0,
        mockExamAverageScore: 100,
      },
    });
  });

  it('createStudentManagementCard', async () => {
    const createCard =
      await studentManagementCardService.createStudentManagementCard({
        lectureId: 1,
        lectureName: '중간고사 영어듣기 뽀개기 특강',
        studentId: student.id,
      });

    card = createCard;

    expect(createCard.lectureName).toBe('중간고사 영어듣기 뽀개기 특강');
    expect(createCard.studentId).toBe(student.id);
  });

  it('updateStudentManagementCard', async () => {
    const updateCard =
      await studentManagementCardService.updateStudentManagementCard(card.id, {
        lectureName: '중간고사 영어듣기 뽀개기 특강2',
        lectureId: 1,
      });

    expect(updateCard.lectureName).toBe('중간고사 영어듣기 뽀개기 특강2');
  });

  it('getStudentManagementCardById', async () => {
    const getCard =
      await studentManagementCardService.getStudentManagementCardById(card.id);

    expect(getCard.id).toBe(card.id);
  });

  it('listStudentManagementCard', async () => {
    const listCard =
      await studentManagementCardService.listStudentManagementCard({
        grades: EStudentGrade.ELEMENTARY,
        lectureName: '뽀개기',
        createDateFrom: new Date('2023-01-01'),
        createDateTo: new Date('2023-12-31'),
      });
    // console.log(JSON.stringify(listCard, null, 2));
    expect(listCard).toBeDefined();
  });

  it('sendStudentManagementCardByIdForParent', async () => {
    const result =
      await studentManagementCardService.sendStudentManagementCardByIdForParent(
        card.id,
      );
    // console.log(result);
    expect(result).toBe(true);
  });

  it('deleteStudentManagementCard', async () => {
    const deleteCard =
      await studentManagementCardService.deleteStudentManagementCardById(
        card.id,
      );
    expect(deleteCard.id).toBe(card.id);
  });
});
