import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import {
  isDevelop,
  isLocal,
  isProduction,
  isTest,
} from '@app/common/configs/env.config';

describe('envConfig', () => {
  beforeEach(async () => {
    await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/test.env',
        }),
      ],
      providers: [ConfigService],
    }).compile();
  });

  it('isTest', () => {
    const result = isTest();
    // console.log(result);
    expect(result).toEqual(true);
  });

  it('isLocal', () => {
    // console.log(result);
    expect(isLocal()).toEqual(false);
  });

  it('isDevelop', () => {
    const result = isDevelop();
    // console.log(result);
    expect(result).toEqual(false);
  });

  it('isDevelop', () => {
    const result = isProduction();
    // console.log(result);
    expect(result).toEqual(false);
  });
});
