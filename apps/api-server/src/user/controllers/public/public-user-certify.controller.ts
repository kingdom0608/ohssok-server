import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import {
  shortNumberId,
  SmsNotification,
  EUserCertifyStatus,
} from '@app/common';
import { UserCertifyService } from '../../services';
import {
  CheckUserCertifyRequestType,
  CheckUserCertifyResponseType,
  CreateUserCertifyRequestType,
  GetUserCertifyResponseType,
} from '../../types';

@ApiTags('[Public] user')
@Controller({
  path: 'public/users',
})
export class PublicUserCertifyController {
  constructor(
    private readonly userCertifyService: UserCertifyService,
    private readonly smsNotification: SmsNotification,
  ) {}

  @ApiOperation({
    summary: '유저 인증 정보 생성',
    description: '유저 전화번호 인증 정보 생성',
  })
  @ApiOkResponse({ type: GetUserCertifyResponseType })
  @Post('/certify')
  async createUserCertify(
    @Body() userCertifyData: CreateUserCertifyRequestType,
  ) {
    /** 6자리 인증 코드 생성*/
    const certifyCode = shortNumberId();

    /** 인증 정보 생성 */
    const createUserCertify = await this.userCertifyService.createUserCertify({
      phoneNumber: userCertifyData.phoneNumber,
      code: certifyCode,
    });

    /** 인증 번호 발송 */
    await this.smsNotification.smsSend(
      userCertifyData.phoneNumber,
      `[ohssok] 본인확인 인증코드 ${certifyCode} 를 화면에 입력 해주세요.`,
    );

    return createUserCertify;
  }

  @ApiOperation({
    summary: '유저 인증 정보 확인',
    description: '유저 전화번호 인증 정보 확인',
  })
  @ApiOkResponse({ type: CheckUserCertifyResponseType })
  @Post('/certify/check')
  async checkUserCertify(@Body() userCertifyData: CheckUserCertifyRequestType) {
    const getUserCertify =
      await this.userCertifyService.getUserCertifyByPhoneNumber(
        userCertifyData.phoneNumber,
      );

    /** 유저 인증 정보 활성화 */
    if (getUserCertify.code === userCertifyData.code) {
      await this.userCertifyService.updateUserCertifyByPhoneNumber(
        userCertifyData.phoneNumber,
        {
          status: EUserCertifyStatus.ACTIVE,
        },
      );
    }

    return {
      isEqualCode: getUserCertify.code === userCertifyData.code,
    };
  }
}
