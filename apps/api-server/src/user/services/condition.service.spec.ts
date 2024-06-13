import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CommonModule,
  Condition,
  DOMAINS,
  EConditionStatus,
  EConditionType,
  generateTypeormModuleOptions,
  User,
  UserAccount,
  UserConditionRelation,
  UserDevice,
  UserRelation,
} from '@app/common';
import { ConditionService } from './condition.service';

describe('ConditionService', () => {
  const content = '<html>약관</html>';
  let conditionService: ConditionService;
  let createCondition;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/test.env',
        }),
        TypeOrmModule.forRootAsync({
          name: DOMAINS.User,
          useFactory: (configService: ConfigService) =>
            generateTypeormModuleOptions(configService, DOMAINS.User),
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature(
          [
            User,
            UserRelation,
            UserConditionRelation,
            UserAccount,
            UserDevice,
            Condition,
          ],
          DOMAINS.User,
        ),
        CommonModule,
      ],
      providers: [ConditionService],
    }).compile();

    conditionService = module.get<ConditionService>(ConditionService);
  });

  it('createCondition', async () => {
    const result = await conditionService.createCondition({
      type: EConditionType.PRIVACY,
      status: EConditionStatus.ACTIVE,
      content: content,
      publicDate: new Date(),
      effectiveDate: new Date(),
    });
    // console.log(result);
    createCondition = result;
    expect(result.content).toEqual(content);
  });

  it('listCondition', async () => {
    const result = await conditionService.listCondition({
      status: EConditionStatus.ACTIVE,
    });
    // console.log(result);
    expect(result.list.length).toBeGreaterThanOrEqual(0);
  });

  it('getConditionById', async () => {
    const result = await conditionService.getConditionById(createCondition.id);
    // console.log(result);
    expect(result.content).toEqual(content);
  });

  it('getActiveConditionByType', async () => {
    const result = await conditionService.getActiveConditionByType(
      EConditionType.PRIVACY,
    );
    // console.log(result);
    expect(result.content).toEqual(content);
  });

  it('updateConditionById', async () => {
    const result = await conditionService.updateConditionById(
      createCondition.id,
      {
        status: EConditionStatus.INACTIVE,
      },
    );
    // console.log(result);
    expect(result.status).toEqual(EConditionStatus.INACTIVE);
  });

  it('deleteConditionById', async () => {
    const result = await conditionService.deleteConditionById(
      createCondition.id,
    );
    // console.log(result);
    expect(result.content).toEqual(content);
  });
});
