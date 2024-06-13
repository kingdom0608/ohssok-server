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
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let categoryService: CategoryService;

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
      providers: [CategoryService],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('카테고리 목록 조회', async () => {
    const result = await categoryService.listCategory({
      upperCategoryId: 1,
    });
    // console.log(result);
    expect(result.list.length).toBeGreaterThan(0);
  });
});
