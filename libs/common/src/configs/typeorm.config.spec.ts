import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { generateTypeormModuleOptions } from '@app/common/configs/typeorm.config';
import { DOMAINS } from '@app/common/constants/domain.constant';

describe('typeormConfig', () => {
  const domainName = DOMAINS.User;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/test.env',
        }),
      ],
      providers: [ConfigService],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  it('generateTypeormModuleOptions', () => {
    const result = generateTypeormModuleOptions(configService, domainName);
    // console.log(result);
    expect(result.database).toEqual(domainName);
  });
});
