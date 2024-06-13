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

describe('StudentManagementCardDetailService', () => {
  let studentManagementCardDetailService: StudentManagementCardDetailService;
  let studentManagementCardService: StudentManagementCardService;
  let studentService: StudentService;
  let student: Student;
  let card: StudentManagementCard;
  let cardDetail: StudentManagementCardDetail;

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
  });

  it('createStudentManagementCardDetail', async () => {
    const createCardDetail =
      await studentManagementCardDetailService.createStudentManagementCardDetail(
        {
          studentManagementCardId: card.id,
          week: '1',
        },
      );

    cardDetail = createCardDetail;

    expect(createCardDetail.studentManagementCardId).toBe(card.id);
    expect(createCardDetail.week).toBe('1');
  });

  it('updateStudentManagementCardDetail', async () => {
    const updateCardDetail =
      await studentManagementCardDetailService.updateStudentManagementCardDetail(
        cardDetail.id,
        {
          blankTestScore: 'A',
        },
      );

    expect(updateCardDetail.blankTestScore).toBe('A');
  });

  it('getStudentManagementCardDetailById', async () => {
    const getCardDetail =
      await studentManagementCardDetailService.getStudentManagementCardDetailById(
        cardDetail.id,
      );

    expect(getCardDetail.id).toBe(cardDetail.id);
  });

  it('listStudentManagementCardDetail', async () => {
    const cardDetail =
      await studentManagementCardDetailService.listStudentManagementCardDetail({
        week: '1',
        studentManagementCardId: card.id,
      });

    expect(cardDetail).toBeDefined();
  });

  it('sendStudentManagementCardDetailForParent', async () => {
    const result =
      await studentManagementCardDetailService.sendStudentManagementCardDetailForParent(
        cardDetail.id,
      );
    // console.log(result);
    expect(result).toBe(true);
  });

  it('deleteStudentManagementCardDetail', async () => {
    const deleteCardDetail =
      await studentManagementCardDetailService.deleteStudentManagementCardDetailById(
        cardDetail.id,
      );
    expect(deleteCardDetail.id).toBe(cardDetail.id);
  });
});
