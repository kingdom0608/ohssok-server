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
import { UpperCategoryService } from './upper-category.service';

describe('UpperCategoryService', () => {
  let upperCategoryService: UpperCategoryService;

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
            Category,
            UpperCategory,
          ],
          DOMAINS.Lecture,
        ),
        CommonModule,
      ],
      providers: [UpperCategoryService],
    }).compile();

    upperCategoryService =
      module.get<UpperCategoryService>(UpperCategoryService);
  });

  it('상위 카테고리 목록 조회', async () => {
    const result = await upperCategoryService.listUpperCategory({});
    // console.log(result);
    expect(result.list.length).toBeGreaterThan(0);
  });
});
