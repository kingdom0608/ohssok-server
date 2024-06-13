import { SolapiMessageService } from 'solapi';
import * as process from 'process';

export class SmsNotification {
  messageService: SolapiMessageService;
  from: string;

  constructor() {
    this.messageService = new SolapiMessageService(
      process.env.NOTIFICATION_API_KEY,
      process.env.NOTIFICATION_API_SECRET,
    );
    this.from = '010-9591-9530';
  }

  /**
   * sms 전송
   * @param to
   * @param text
   */
  async smsSend(to: string, text: string): Promise<boolean> {
    try {
      await this.messageService.send({
        to: to,
        from: this.from,
        text: text,
      });

      return true;
    } catch (err) {
      throw err;
    }
  }
}
