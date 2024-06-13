import {
  AuthenticationGuard,
  EAuthenticationUserRole,
  UserRoleGuard,
} from '@app/authentication';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthenticationService } from '../services';
import {
  AuthenticationIssueTokenQueryRequestType,
  AuthenticationResponseType,
} from '../types';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiOperation({
    summary: '토큰 발행 (로컬 개발용)',
    description: '토큰 발행 (로컬 개발용)',
  })
  @ApiOkResponse({ type: AuthenticationResponseType })
  @Post('tokens/local')
  async issueToken(@Query() query: AuthenticationIssueTokenQueryRequestType) {
    const { role } = query;

    const { accessToken, refreshToken } =
      await this.authenticationService.issueToken({
        role: role,
      });

    return {
      accessToken,
      refreshToken,
    };
  }

  @ApiOperation({
    summary: '토큰 검증',
    description: '토큰 검증',
  })
  @ApiOkResponse({ type: AuthenticationResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.STUDENT,
      EAuthenticationUserRole.PARENTS,
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Get('token/verify')
  async validateToken() {
    return true;
  }
}
