import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UnauthenticatedException extends HttpException {
  public constructor() {
    super(
      { code: '40101', message: '인증되지 않았습니다.', data: null },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

@Injectable()
export class InvalidSessionException extends HttpException {
  public constructor() {
    super(
      { code: '40103', message: '만료된 세션입니다.', data: null },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

@Injectable()
export class ForbiddenException extends HttpException {
  public constructor() {
    super(
      { code: '40301', message: '권한이 존재하지 않습니다.', data: null },
      HttpStatus.FORBIDDEN,
    );
  }
}
