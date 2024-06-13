import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication';
import { UserModule } from './user';
import { LectureModule } from './lecture';
import { DisplayModule } from './display';
import { StudentModule } from './student';
import { OperatorModule } from './operator';
import { ContentModule } from './content/content.module';
import { LoggerMiddleware } from '@app/common';

@Module({
  imports: [
    AuthenticationModule,
    UserModule,
    LectureModule,
    DisplayModule,
    StudentModule,
    OperatorModule,
    ContentModule,
  ],
  controllers: [],
  providers: [],
})
export class ApiServerModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
