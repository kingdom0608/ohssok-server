import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AuthenticationGuard,
  EAuthenticationUserRole,
  UserRoleGuard,
} from '@app/authentication';
import {
  UserAuthService,
  UserCertifyService,
  UserService,
} from '../../services';
import {
  CreateAdminUserForAdminRequestType,
  GetUserResponseType,
  SignInRequestType,
  SignInResponseType,
  UpdateUserRequestType,
  UpdateUserRoleRequestType,
  UserQueryRequestType,
} from '../../types';
import { EUserRole, InternalApiService } from '@app/common';

@ApiTags('[Admin] user')
@Controller({
  path: 'admin/users',
})
export class AdminUserController {
  constructor(
    private readonly internalApiService: InternalApiService,
    private readonly userService: UserService,
    private readonly userAuthService: UserAuthService,
    private readonly userCertifyService: UserCertifyService,
  ) {}

  @ApiOperation({
    summary: '어드민 유저 생성',
    description: '어드민 유저 생성',
  })
  @ApiOkResponse({ type: GetUserResponseType })
  @Post('/admin')
  async createAdminUserForAdmin(
    @Body() userData: CreateAdminUserForAdminRequestType,
  ) {
    /** 인증 완료 유저 체크 */
    await this.userCertifyService.getActiveUserCertifyByPhoneNumber(
      userData.phoneNumber,
    );

    return this.userService.createAdminUserForAdmin(userData);
  }

  @ApiOperation({
    summary: '어드민 유저 목록 조회',
    description: '어드민 유저 목록 조회',
  })
  @ApiOkResponse({ type: GetUserResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Get()
  async listForAdmin(@Query() query: UserQueryRequestType) {
    return this.userService.listUser(query);
  }
  @ApiOperation({
    summary: '어드민 유저 아이디 단일 조회',
    description: '어드민 유저 아이디 단일 조회',
  })
  @ApiOkResponse({ type: GetUserResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Get('user-id/:userId')
  async getUserByIdForAdmin(@Param('userId') userId: number) {
    return this.userService.getUserById(userId);
  }

  @ApiOperation({
    summary: '어드민 유저 권한 업데이트',
    description: '어드민 유저 권한 업데이트',
  })
  @ApiOkResponse({ type: GetUserResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(UserRoleGuard([EAuthenticationUserRole.OWNER]))
  @Put('user-id/:userId/role')
  async updateUserRoleForAdmin(
    @Param('userId') userId: number,
    @Body()
    userData: UpdateUserRoleRequestType,
  ) {
    return await this.userService.updateUserById(userId, userData);
  }

  @ApiOperation({
    summary: '어드민 유저 업데이트',
    description: '어드민 유저 업데이트',
  })
  @ApiOkResponse({ type: GetUserResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
    ]),
  )
  @Put('user-id/:userId')
  async updateUserForAdmin(
    @Param('userId') userId: number,
    @Body()
    userData: UpdateUserRequestType,
  ) {
    const updateUser = await this.userService.updateUserById(userId, userData);

    if (updateUser.role === EUserRole.STUDENT) {
      const UPDATE_STUDENT = `internal/students/user-id/${userId}`;
      await this.internalApiService.put(UPDATE_STUDENT, {
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        birthday: userData.birthday,
      });
    }

    return updateUser;
  }

  @ApiOperation({
    summary: '어드민 로그인',
    description: '어드민 로그인',
  })
  @ApiOkResponse({ type: SignInResponseType })
  @Post('sign-in/admin')
  async signIn(@Body() signInData: SignInRequestType) {
    return await this.userAuthService.signInForAdmin(signInData);
  }
}
