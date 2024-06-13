import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import {
  UserAuthService,
  UserCertifyService,
  UserService,
} from '../../services';
import { GetUserResponseType } from '../../types';
import { SqsService } from '@app/common';

@ApiTags('[Internal] user')
@Controller({
  path: 'internal/users',
})
export class InternalUserController {
  constructor(
    private readonly sqsService: SqsService,
    private readonly userService: UserService,
    private readonly userAuthService: UserAuthService,
    private readonly userCertifyService: UserCertifyService,
  ) {}

  @ApiOperation({
    summary: 'Internal 유저 아이디 단일 조회',
    description: 'Internal 유저 아이디 단일 조회',
  })
  @ApiOkResponse({ type: GetUserResponseType })
  @Get('user-id/:userId')
  async getUserByIdForInternal(@Param('userId') userId: number) {
    return this.userService.getUserById(userId);
  }
}
