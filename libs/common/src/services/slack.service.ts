import axios from 'axios';
import { ESlackChannel } from '@app/common/enums';

export class SlackService {
  private readonly stage: string;
  private readonly webhookPath: object;

  constructor(private readonly paths: object) {
    this.stage = process.env.STAGE;
    if (this.stage === 'production') {
      this.webhookPath = this.paths
        ? this.paths
        : {
            EVENTSERVER: 'T04L8U745LG/B05GNH0EWMD/7to0ctm6MJtpKTzSEF0RGYgM',
          };
    } else {
      this.webhookPath = this.paths
        ? this.paths
        : {
            EVENTSERVER: 'T04L8U745LG/B05GV0X9K54/yMR7dDkxfQAlMi5VYGUWCA5U',
          };
    }
  }

  private getChannelPath(channel: ESlackChannel): string {
    const path: string = this.webhookPath[channel];
    if (!path) {
      throw new Error('Channels not supported');
    }
    return path;
  }

  /**
   * 슬랙 메세지 전송
   * @param channel
   * @param message
   */
  async sendSlackMessage(
    channel: ESlackChannel,
    message: {
      text: string;
      attachments: Array<object>;
    },
  ) {
    try {
      const path = this.getChannelPath(channel);
      const url = `https://hooks.slack.com/services/${path}`;

      /**
       * 슬랙 메시지 전송 실패시 서버 에러가 발생 하지 않게 하기 위해 setImmediate 처리
       */
      setImmediate(() => {
        axios
          .post(url, message)
          .then((response) => response.data)
          .catch((err) => {
            if (err.response?.code !== 429)
              /** slack 429 과다 접속 오류 로그 */
              console.error(err.meesage);
          });
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
}
