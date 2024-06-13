import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SmsNotification } from '@app/common/notifications/sms-notification';

describe('SmsNotification', () => {
  const to = '01012345678';
  let smsNotification: SmsNotification;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/test.env',
        }),
      ],
      providers: [SmsNotification],
    }).compile();

    smsNotification = module.get<SmsNotification>(SmsNotification);
  });

  it('smsSend', async () => {
    const result = await smsNotification.smsSend(
      to,
      '[ohssok] 인증 번호는 123456 입니다.',
    );
    // console.log(result);
    expect(result).toEqual(true);
  });
});
