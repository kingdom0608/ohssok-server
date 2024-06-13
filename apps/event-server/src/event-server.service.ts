import { Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { SqsService } from '@app/common';
import * as process from 'process';
import { EEventPattern } from '@app/common/enums/event/pattern.enum';
import { StudentService, StudentManagementCardService } from './student';
import { Message } from '@aws-sdk/client-sqs';

@Injectable()
export class EventServerService {
  constructor(
    private readonly sqsService: SqsService,
    private readonly studentService: StudentService,
    private readonly studentManagementCardService: StudentManagementCardService,
  ) {}

  @SqsMessageHandler(`${process.env.NODE_ENV}-event.fifo`, false)
  async handleMessage(message: Message) {
    await this.sqsService.deleteEventMessage(message);

    const { pattern, data } = JSON.parse(message.Body);

    switch (pattern) {
      /** 유저 생성*/
      case EEventPattern.CREATE_USER:
        await this.studentService.createStudent({
          ...data,
        });
        break;
      case EEventPattern.UPDATE_USER:
        await this.studentService.updateStudent({
          ...data,
        });
        break;
      case EEventPattern.UPDATE_LECTURE:
        await this.studentManagementCardService.updateStudentManagementCard({
          ...data,
        });
        break;
      default:
        break;
    }

    return message;
  }
}
