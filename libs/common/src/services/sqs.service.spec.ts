import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { EStudentGrade, SqsService } from '@app/common';

describe('SqsService', () => {
  let sqsService: SqsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/test.env',
        }),
        SqsService,
      ],
    }).compile();

    sqsService = app.get<SqsService>(SqsService);
  });

  it('sendEventMessage', async () => {
    const result = await sqsService.sendEventMessage({
      pattern: 'CREATE_USER',
      requester: 'requester',
      data: {
        user: {
          id: 1,
          name: '홍길동',
        },
        student: {
          // schoolName: '성보고등학교',
          grade: EStudentGrade.HIGH_3,
          internalExamAverageScore: 100,
          mockExamAverageScore: 100,
        },
      },
    });
    // console.log(result);
    expect(result['$metadata'].httpStatusCode).toEqual(200);
  });
});
