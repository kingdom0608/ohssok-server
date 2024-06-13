import { HttpException, HttpStatus } from '@nestjs/common';

export class GatewayTimeoutHttpException extends HttpException {
  public constructor() {
    super(
      {
        code: '0013',
        message: '게이트웨이 시간 초과 오류 입니다',
        data: null,
      },
      HttpStatus.GATEWAY_TIMEOUT,
    );
  }
}

export class GoneHttpException extends HttpException {
  public constructor() {
    super(
      {
        code: '0012',
        message: 'Deprecated.',
        data: null,
      },
      HttpStatus.GONE,
    );
  }
}
