import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthenticationGuard, CurrentUser } from '@app/authentication';
import {
  InternalApiService,
  EUserRole,
  isLocal,
  S3Service,
  SqsService,
} from '@app/common';
import {
  UserAccountService,
  UserAuthService,
  UserCertifyService,
  UserService,
} from '../../services';
import {
  CreateUserRequestType,
  GetUserResponseType,
  ReissueAccessTokenRequestType,
  SignInRequestType,
  SignInResponseType,
  UploadUserProfileImageResponseType,
} from '../../types';

@ApiTags('[Public] user')
@Controller({
  path: 'public/users',
})
export class PublicUserController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly sqsService: SqsService,
    private readonly internalApiService: InternalApiService,
    private readonly userService: UserService,
    private readonly userAccountService: UserAccountService,
    private readonly userCertifyService: UserCertifyService,
    private readonly userAuthService: UserAuthService,
  ) {}

  @ApiOperation({
    summary: '기본 유저 생성',
    description: '기본 유저 생성',
  })
  @ApiOkResponse({ type: GetUserResponseType })
  @Post('/basic')
  async createUserForBasic(@Body() userData: CreateUserRequestType) {
    /** 인증 완료 유저 체크 */
    if (!isLocal()) {
      await this.userCertifyService.getActiveUserCertifyByPhoneNumber(
        userData.phoneNumber,
      );
    }

    const createUser = await this.userService.createUser(userData);

    /** 유저 - 학생 정보 동기화 */
    if (createUser.role === EUserRole.STUDENT) {
      const CREATE_STUDENT = 'internal/students/student';
      await this.internalApiService.post(CREATE_STUDENT, {
        userId: createUser.id,
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        birthday: userData.birthday,
        parentPhoneNumber: userData.parentPhoneNumber,
        grade: userData.grade,
        internalExamAverageScore: userData.internalExamAverageScore,
        mockExamAverageScore: userData.mockExamAverageScore,
      });
    }

    return createUser;
  }

  // @ApiOperation({
  //   summary: '카카오톡 로그인',
  //   description: '카카오톡 로그인',
  // })
  // @ApiOkResponse({ type: SignInResponseType })
  // @Post('sign-in/kakao')
  // async signInForKakao(@Body() kakaoCode: KakaoCodeRequestType) {
  //   const code = kakaoCode.code;
  //   const kakaoAccessToken = await this.userAuthService.signInForKakao(code);
  //   const { email } = await this.userAuthService.getUserInfoFromKakao(
  //     kakaoAccessToken,
  //   );
  //
  //   return await this.userAuthService.signIn({
  //     email,
  //     provider: EUserAccountProvider.KAKAO,
  //   });
  // }

  // @ApiOperation({
  //   summary: '카카오톡 회원가입',
  //   description: '카카오톡 API 회원가입',
  // })
  // @ApiOkResponse({ type: GetUserResponseType })
  // @Post('sign-up/kakao')
  // async createUserForKakao(@Body() userData: CreateUserRequestType) {
  //   /** 인증 완료 유저 체크 */
  //   await this.userCertifyService.getActiveUserCertifyByPhoneNumber(
  //     userData.phoneNumber,
  //   );
  //   const kakaoAccessToken = await this.userAuthService.signUpForKakao(
  //     userData.code,
  //   );
  //   const { email } = await this.userAuthService.getUserInfoFromKakao(
  //     kakaoAccessToken,
  //   );
  //
  //   return this.userService.createUser({
  //     name: userData.name,
  //     displayName: userData.displayName,
  //     phoneNumber: userData.phoneNumber,
  //     role: userData.role,
  //     accounts: [
  //       {
  //         email: email,
  //         provider: EUserAccountProvider.KAKAO,
  //       },
  //     ],
  //   });
  // }

  @ApiOperation({
    summary: '로그인 유저 조회',
    description: '로그인 유저 조회',
  })
  @ApiOkResponse({ type: GetUserResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @Get('user')
  getUser(@CurrentUser() currentUser) {
    return this.userService.getUserById(currentUser.id);
  }

  @ApiOperation({
    summary: '유저 아이디 조회',
    description: '유저 아이디 조회',
  })
  @ApiOkResponse({ type: GetUserResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @Get('user-id/:userId')
  getUserById(@Param('userId') userId: number) {
    return this.userService.getUserById(userId);
  }

  @ApiOperation({
    summary: '로그인',
    description: '로그인',
  })
  @ApiOkResponse({ type: SignInResponseType })
  @Post('sign-in/basic')
  async signIn(@Body() signInData: SignInRequestType) {
    return await this.userAuthService.signIn(signInData);
  }

  @ApiOperation({
    summary: '액세스 토큰 재발급',
    description: '액세스 토큰 재발급',
  })
  @ApiOkResponse({ type: SignInResponseType })
  @Post('access-token/reissue')
  async reissueAccessToken(
    @Body() reissueAccessTokenData: ReissueAccessTokenRequestType,
  ) {
    return await this.userAuthService.reissueAccessToken(
      reissueAccessTokenData,
    );
  }

  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃',
  })
  @ApiOkResponse({ type: Boolean })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @Post('sign-out')
  async logout(@CurrentUser() currentUser) {
    const result = await this.userAccountService.updateUserAccountByUidProvider(
      currentUser.uid,
      currentUser.provider,
      {
        refreshToken: null,
      },
    );

    return !!result;
  }

  @ApiOperation({
    summary: '회원 탈퇴',
    description: '회원 탈퇴',
  })
  @ApiOkResponse({ type: GetUserResponseType })
  @Post('resign')
  async resign(@Body() signInData: SignInRequestType) {
    const deletedUser = await this.userAuthService.resign(signInData);

    return {
      id: deletedUser.id,
      name: deletedUser.name,
      displayName: deletedUser.displayName,
      phoneNumber: deletedUser.phoneNumber,
    };
  }

  @ApiOperation({
    summary: '프로필 이미지 Url 생성',
    description: '프로필 이미지 Url 생성',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  @ApiOkResponse({ type: [UploadUserProfileImageResponseType] })
  @Post('user/profile')
  async createUserProfileImageUrl(
    @Body()
    userProfileImageUrlData: {
      id: number;
    },
    @UploadedFiles() upload: ParameterDecorator,
  ) {
    const { id } = userProfileImageUrlData;
    const images: Express.Multer.File[] = upload['files'] || [];
    const uploadImage = images.map((image: Express.Multer.File) => {
      return {
        image,
        key: `profiles/users/${id}`,
      };
    });

    return this.s3Service.createPublicImageFiles(uploadImage);
  }
}
