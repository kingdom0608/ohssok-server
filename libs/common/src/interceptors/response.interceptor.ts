import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { DEFAULT_MESSAGE, ResponseCodeMessage } from '@app/common/exceptions';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface IResponseBody<T> {
  code: string;
  message: string;
  data?: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, IResponseBody<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponseBody<T>> {
    const request = context.switchToHttp().getRequest();
    // if (['DELETE', 'PATCH'].includes(request.method)) {
    //   context.switchToHttp().getResponse().status(HttpStatus.NO_CONTENT);
    // }
    if (request.url.includes('swagger')) {
      return next.handle();
    }
    return next
      .handle()
      .pipe(
        map(({ pagination, ...data }) => {
          return {
            code: ResponseCodeMessage.Ok.code,
            message: ResponseCodeMessage.Ok.message,
            data: data?.list || (Object.keys(data).length ? data : null),
            pagination: pagination,
          };
        }),
      )
      .pipe(
        catchError((err) =>
          throwError(() => {
            const [metaCode] = err.metadata?.toJSON()?.code || [];
            const code =
              err.response?.statusCode ||
              metaCode ||
              Object.values(ResponseCodeMessage)[err.code]?.code ||
              ResponseCodeMessage.DefaultInternalError.code;
            const message =
              err.response?.message ||
              (err.details !== 'Internal server error' ? err.details : null) ||
              DEFAULT_MESSAGE;
            const Exception =
              code === ResponseCodeMessage.DefaultInternalError.code ||
              code === ResponseCodeMessage.Unknown.code
                ? InternalServerErrorException
                : BadRequestException;

            if (
              code === ResponseCodeMessage.DefaultInternalError.code ||
              code === ResponseCodeMessage.Unknown.code
            ) {
              console.log(err);
            }
            /** 중복 메세지 제거 */
            delete err.response;

            throw new Exception({
              code,
              message,
              data: null,
              error: {
                ...err,
                ...Object.values(ResponseCodeMessage).find(
                  (o) => o.code === code,
                ),
              },
            });
          }),
        ),
      );
  }
}
