import { Module } from '@nestjs/common';
import { EncryptionHelper } from '@app/common/helpers';
import {
  S3Service,
  SlackService,
  SqsService,
  InternalApiService,
} from '@app/common/services';
import { SmsNotification } from '@app/common/notifications';

@Module({
  providers: [
    EncryptionHelper,
    S3Service,
    SqsService,
    SlackService,
    SmsNotification,
    InternalApiService,
  ],
  exports: [
    EncryptionHelper,
    S3Service,
    SqsService,
    SlackService,
    SmsNotification,
    InternalApiService,
  ],
})
export class CommonModule {}
