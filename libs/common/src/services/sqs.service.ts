import { v4 as uuidv4 } from 'uuid';
import * as process from 'process';
import {
  DeleteMessageCommand,
  DeleteMessageCommandOutput,
  SendMessageCommand,
  SendMessageCommandInput,
  SendMessageCommandOutput,
  Message,
  SQSClient,
} from '@aws-sdk/client-sqs';

export interface IMessageBody {
  pattern: 'CREATE_USER' | 'UPDATE_USER' | 'UPDATE_LECTURE';
  requester?: string;
  data: object;
}

export class SqsService {
  private sqs: SQSClient;
  private readonly queueUrl: string;

  constructor() {
    this.sqs = new SQSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.queueUrl = process.env.AWS_SQS_EVENT_QUEUE_URL;
  }

  /**
   * 이벤트 메세지 전송
   * @param messageBody
   */
  sendEventMessage(
    messageBody: IMessageBody,
  ): Promise<SendMessageCommandOutput> | string {
    const params: SendMessageCommandInput = {
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(messageBody),
      MessageGroupId: uuidv4(),
    };

    const command: SendMessageCommand = new SendMessageCommand(params);
    return this.sqs.send(command);
  }

  /**
   * 이벤트 메세지 삭제
   * @param message
   */
  deleteEventMessage(message: Message): Promise<DeleteMessageCommandOutput> {
    // eslint-disable-next-line no-useless-catch
    try {
      const command: DeleteMessageCommand = new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: message.ReceiptHandle,
      });

      return this.sqs.send(command);
    } catch (err) {
      throw err;
    }
  }
}
