import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ESlackChannel, SlackService } from '@app/common';

describe('SlackService', () => {
  let slackService: SlackService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/test.env',
        }),
        SlackService,
      ],
    }).compile();

    slackService = app.get<SlackService>(SlackService);
  });

  it('sendSlackMessage', async () => {
    const result = await slackService.sendSlackMessage(
      ESlackChannel.EVENTSERVER,
      {
        text: 'title',
        attachments: [
          {
            color: '#FF0000',
            mrkdwn_in: ['text', 'fields'],
            fields: [
              {
                title: 'title',
                value: 'value',
                short: false,
              },
            ],
          },
        ],
      },
    );
    // console.log(result);
    expect(result).toBe(true);
  });
});
