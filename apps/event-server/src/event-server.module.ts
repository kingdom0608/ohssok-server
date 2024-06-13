import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SqsModule } from '@ssut/nestjs-sqs';
import { CommonModule, parsedEnvFile } from '@app/common';
import * as process from 'process';
import { EventServerService } from './event-server.service';
import { StudentModule } from './student';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: parsedEnvFile(),
    }),
    SqsModule.register({
      consumers: [
        {
          name: process.env.AWS_SQS_EVENT_QUEUE_NAME,
          queueUrl: process.env.AWS_SQS_EVENT_QUEUE_URL,
          region: process.env.AWS_REGION,
        },
      ],
      producers: [],
    }),
    CommonModule,
    StudentModule,
  ],
  controllers: [],
  providers: [EventServerService],
})
export class EventServerModule {}
