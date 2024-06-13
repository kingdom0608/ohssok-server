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
  NotFoundException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EUserAccountErrorMessage, EUserErrorMessage } from '@app/common';
import {
  UserAccountService,
  UserCertifyService,
  UserService,
} from '../../services';
import {
  CheckUserAccountByUid,
  CheckUserAccountRequestType,
  CheckUserAccountUidRequestType,
  GetUserAccountUidRequestType,
  GetUserResponseType,
  ResetUserAccountPasswordForSignInRequestType,
  ResetUserAccountPasswordRequestType,
} from '../../types';
import { AuthenticationGuard, CurrentUser } from '@app/authentication';

@ApiTags('[Public] user')
@Controller({
  path: 'public/user-accounts',
})
export class PublicUserAccountController {
  constructor(
    private readonly userService: UserService,
    private readonly userAccountService: UserAccountService,
    private readonly userCertifyService: UserCertifyService,
  ) {}

  @ApiOperation({
    summary: '비밀번호 찾기 회원 검증',
    description: '비밀번호 찾기 회원 검증',
  })
  @ApiOkResponse({ type: GetUserResponseType })
  @Post('password/check')
  async checkUserAccount(
    @Body() checkUserAccountData: CheckUserAccountRequestType,
  ) {
    const getUser = await this.userService.getUserByUidAndNameAndPhoneNumber(
      checkUserAccountData.uid,
      checkUserAccountData.name,
      checkUserAccountData.phoneNumber,
    );

    /** 인증 완료 체크 */
    await this.userCertifyService.getActiveUserCertifyByPhoneNumber(
      checkUserAccountData.phoneNumber,
    );

    /** 아이디 마스킹 처리 */
    getUser.accounts.map((account) => {
      delete account.password;
      delete account.refreshToken;
    });

    return { ...getUser };
  }

  @ApiOperation({
    summary: '비밀번호 재설정',
    description: '비밀번호 재설정',
  })
  @ApiOkResponse({ type: GetUserResponseType })
  @Post('password/reset')
  async resetUserAccountPassword(
    @Body() userData: ResetUserAccountPasswordRequestType,
  ) {
    const getUser = await this.userService.getUserByUidAndNameAndPhoneNumber(
      userData.uid,
      userData.name,
      userData.phoneNumber,
    );

    if (getUser.accounts.length === 0) {
      throw new NotFoundException(EUserErrorMessage.USER_NOT_FOUND_MATCHING);
    }

    await this.userAccountService.updateUserAccountByUidProvider(
      getUser.accounts[0].uid,
      getUser.accounts[0].provider,
      {
        password: userData.newPassword,
      },
    );

    delete getUser.accounts;

    return getUser;
  }

  @ApiOperation({
    summary: '유저 비밀번호 재설정',
    description: '유저 비밀번호 재설정',
  })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @ApiOkResponse({ type: GetUserResponseType })
  @Post('user/password/reset')
  async resetUserAccountPasswordForUser(
    @CurrentUser() currentUser,
    @Body() userData: ResetUserAccountPasswordForSignInRequestType,
  ) {
    const getUser = await this.userService.getUserByIdForPasswordReset(
      currentUser.id,
      {
        nowPassword: userData.nowPassword,
      },
    );

    await this.userAccountService.updateUserAccountByUidProvider(
      getUser.accounts[0].uid,
      getUser.accounts[0].provider,
      {
        password: userData.newPassword,
      },
    );

    delete getUser.accounts;

    return getUser;
  }

  @ApiOperation({
    summary: '유저 계정 ID 검증',
    description: '유저 계정 ID 검증',
  })
  @ApiOkResponse({ type: CheckUserAccountByUid })
  @Post('uid/check')
  async checkUserAccountByUid(
    @Body() checkUserAccountData: CheckUserAccountUidRequestType,
  ) {
    try {
      await this.userAccountService.getUserAccountByUid(
        checkUserAccountData.uid,
      );

      return {
        isExistUid: true,
      };
    } catch (err) {
      if (err.message === EUserAccountErrorMessage.USER_ACCOUNT_NOT_FOUND) {
        return {
          isExistUid: false,
        };
      } else {
        throw err;
      }
    }
  }

  @ApiOperation({
    summary: '계정 ID 찾기',
    description: '계정 ID 찾기',
  })
  @ApiOkResponse({ type: GetUserResponseType })
  @Get('uid')
  async getUserAccountByNamePhoneNumber(
    @Query() getUserAccountData: GetUserAccountUidRequestType,
  ) {
    const getUser = await this.userService.getUserByNameAndPhoneNumber(
      getUserAccountData.name,
      getUserAccountData.phoneNumber,
    );

    /** 인증 완료 체크 */
    await this.userCertifyService.getActiveUserCertifyByPhoneNumber(
      getUserAccountData.phoneNumber,
    );

    if (getUser.accounts.length === 0) {
      throw new NotFoundException(EUserErrorMessage.USER_NOT_FOUND_MATCHING);
    }

    /** 아이디 마스킹 처리 */
    getUser.accounts.map((account) => {
      account.uid = account.uid.replace(/(?<=.{3})./gi, '*');

      delete account.password;
      delete account.refreshToken;
    });

    return { ...getUser };
  }
}
