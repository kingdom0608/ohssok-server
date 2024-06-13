import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { generateTypeormModuleOptions } from '@app/common/configs/typeorm.config';
import {
  Category,
  CommonModule,
  DOMAINS,
  Lecture,
  LectureContent,
  LectureTag,
  Teacher,
  UpperCategory,
} from '@app/common';
import { LectureContentService } from './lecture-content.service';
import { Textbook } from '@app/common/entities/lecture/textbook.entity';
import { LectureThumbnail } from '@app/common/entities/lecture/lecture-thumbnail.entity';

describe('LectureContentService', () => {
  const lectureContentName = 'OT';
  let lectureContentService: LectureContentService;
  let createLectureContent: LectureContent;

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
            LectureThumbnail,
            LectureTag,
            Teacher,
            Category,
            UpperCategory,
            Textbook,
          ],
          DOMAINS.Lecture,
        ),
        CommonModule,
      ],
      providers: [LectureContentService],
    }).compile();

    lectureContentService = module.get<LectureContentService>(
      LectureContentService,
    );
  });

  afterAll(async () => {
    /** 테스트 유저 삭제 */
  });

  it('강의 컨텐츠 생성', async () => {
    const result = await lectureContentService.createLectureContent({
      lectureId: 0,
      sequence: 1,
      name: lectureContentName,
      time: '01:00:00',
      page: null,
    });
    // console.log(result);
    createLectureContent = result;
    expect(result.name).toEqual(lectureContentName);
  });

  it('강의 컨텐츠 아이디 조회', async () => {
    const result = await lectureContentService.getLectureContentById(
      createLectureContent.id,
    );
    // console.log(result);
    expect(result.name).toEqual(lectureContentName);
  });

  it('강의 컨텐츠 수정', async () => {
    const updateLectureContentData = {
      lectureId: 1,
      sequence: 3,
      name: lectureContentName,
      time: '01:30:00',
      page: 'test',
    };
    const updatedLectureContent =
      await lectureContentService.updateLectureContent(
        createLectureContent.id,
        updateLectureContentData,
      );
    expect(updatedLectureContent.name).toEqual(lectureContentName);
  });

  it('강의 컨텐츠 아이디 삭제', async () => {
    const result = await lectureContentService.deleteLectureContentById(
      createLectureContent.id,
    );
    // console.log(result);
    expect(result.name).toEqual(lectureContentName);
  });
});
