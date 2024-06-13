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
import { faker } from '@faker-js/faker';
import { TextbookService } from './textbook.service';
import { Textbook } from '@app/common/entities/lecture/textbook.entity';

describe('TextbookService', () => {
  const name = faker.internet.userName();
  let textbookService: TextbookService;
  let createTextbook: Textbook;

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
            Teacher,
            Textbook,
            Category,
            UpperCategory,
          ],
          DOMAINS.Lecture,
        ),
        CommonModule,
      ],
      providers: [TextbookService],
    }).compile();

    textbookService = module.get<TextbookService>(TextbookService);
  });

  afterAll(async () => {
    /** 테스트 유저 삭제 */
  });

  it('교재 생성', async () => {
    const result = await textbookService.createTextbook({
      imageId: 1,
      imageUrl: faker.internet.url(),
      name: name,
      author: '오현진',
      page: '100 페이지',
      size: '191*260*20mm',
      description: '영어 교재',
      publishDate: new Date(),
    });
    // console.log(result);
    createTextbook = result;
    expect(result.name).toEqual(name);
  });

  it('교재 목록 조회', async () => {
    const result = await textbookService.listTextbook({});
    // console.log(result);
    expect(result.list.length).toBeGreaterThan(0);
  });

  it('교재 아이디 조회', async () => {
    const result = await textbookService.getTextbookById(createTextbook.id);
    // console.log(result);
    expect(result.name).toEqual(name);
  });

  it('교재 수정', async () => {
    const result = await textbookService.updateTextbookById(createTextbook.id, {
      page: '200 페이지',
    });
    // console.log(result);
    expect(result.page).toEqual('200 페이지');
  });

  it('교재 삭제', async () => {
    const result = await textbookService.deleteTextbookById(createTextbook.id);
    // console.log(result);
    expect(result.name).toEqual(name);
  });
});
