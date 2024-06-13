import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { generateTypeormModuleOptions } from '@app/common/configs/typeorm.config';
import {
  Category,
  CommonModule,
  DOMAINS,
  ELectureLevel,
  EStudentGrade,
  Lecture,
  LectureContent,
  LectureTag,
  Teacher,
  UpperCategory,
} from '@app/common';
import { faker } from '@faker-js/faker';
import { LectureService } from './lecture.service';
import { LectureThumbnail } from '@app/common/entities/lecture/lecture-thumbnail.entity';
import { Textbook } from '@app/common/entities/lecture/textbook.entity';

describe('LectureService', () => {
  const name = faker.internet.userName();
  let lectureService: LectureService;
  let createLecture: Lecture;

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
          [
            Lecture,
            LectureContent,
            LectureTag,
            Textbook,
            LectureThumbnail,
            Teacher,
            Category,
            UpperCategory,
          ],
          DOMAINS.Lecture,
        ),
        CommonModule,
      ],
      providers: [LectureService],
    }).compile();

    lectureService = module.get<LectureService>(LectureService);
  });

  afterAll(async () => {
    /** 테스트 유저 삭제 */
  });

  it('강의 생성', async () => {
    const result = await lectureService.createLecture({
      teacherId: 1,
      categoryId: 1,
      textbookId: 1,
      name: name,
      level: ELectureLevel.Easy,
      learningStage: '개념완성',
      scope: 'Lessons 5 ~ Lessons 8(+ Special Lesson 2 포함)',
      feature: '교과서 밀착 분석을 통한 내신만점대비 강좌',
      subjectGroup: EStudentGrade.MIDDLE_1,
      subjectGroupDescription: '교과서 밀착 분석을 통한 내신만점대비 강좌',
      price: 30000,
      description: '교과서 밀착 분석을 통한 내신만점대비 강좌',
      tags: [
        {
          name: '자체교재',
        },
        {
          name: '문법',
        },
      ],
      thumbnails: [
        {
          imageId: 1,
          imageUrl: 'image.url',
          sequence: 1,
        },
      ],
    });
    // console.log(result);
    createLecture = result;
    expect(result.name).toEqual(name);
    expect(result.thumbnails.length).toEqual(1);
  });

  it('강의 복수 조회', async () => {
    const result = await lectureService.listLecture({
      level: ELectureLevel.Easy,
    });
    // console.log(result);
    expect(result.list.length).toBeGreaterThan(0);
  });

  it('강의 아이디 조회', async () => {
    const result = await lectureService.getLectureById(createLecture.id);
    // console.log(result);
    expect(result.name).toEqual(name);
  });

  it('강의 수정', async () => {
    const updateLectureData = {
      teacherId: 2,
      name: name,
      level: ELectureLevel.Hard,
      learningStage: '테스트 완성',
      scope: 'Test Lesson',
      description: '설명 Test',
      subjectGroup: EStudentGrade.MIDDLE_1,
      thumbnails: [
        {
          imageId: 2,
          imageUrl: 'image.url',
          sequence: 1,
        },
        {
          imageId: 3,
          imageUrl: 'image.url',
          sequence: 2,
        },
      ],
    };
    const updatedLecture = await lectureService.updateLecture(
      createLecture.id,
      updateLectureData,
    );
    expect(updatedLecture.name).toEqual(updateLectureData.name);

    expect(updatedLecture.thumbnails.length).toEqual(2);
    expect(updatedLecture.thumbnails[0].imageId).toEqual(2);
  });

  it('강의 삭제', async () => {
    const result = await lectureService.deleteLectureById(createLecture.id);
    // console.log(result);
    expect(result.name).toEqual(name);
  });
});
