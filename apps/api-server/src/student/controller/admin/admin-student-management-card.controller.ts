import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EStudentManagementCardErrorMessage } from '@app/common';
import {
  AuthenticationGuard,
  EAuthenticationUserRole,
  UserRoleGuard,
} from '@app/authentication';
import { StudentManagementCardService } from '../../services';
import {
  GetStudentManagementCardResponseType,
  CreateStudentManagementCardRequestType,
  StudentManagementCardQueryRequestType,
  UpdateStudentManagementCardRequestType,
} from '../../types';

@ApiTags('[Admin] student')
@Controller({
  path: 'admin/student-management-cards',
})
export class AdminStudentManagementCardController {
  constructor(
    private readonly studentManagementCardService: StudentManagementCardService,
  ) {}

  @ApiOperation({
    summary: '어드민 학생 관리 카드 생성',
    description: '어드민 학생 관리 카드 생성',
  })
  @ApiOkResponse({ type: GetStudentManagementCardResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Post('/student-management-card')
  async createStudentManagementCardForAdmin(
    @Body() studentManagementCardData: CreateStudentManagementCardRequestType,
  ) {
    return this.studentManagementCardService.createStudentManagementCard(
      studentManagementCardData,
    );
  }

  @ApiOperation({
    summary: '어드민 학생 관리 카드 목록 조회',
    description: '어드민 학생 관리 카드 목록 조회',
  })
  @ApiOkResponse({ type: GetStudentManagementCardResponseType })
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
  async listStudentManagementCardForAdmin(
    @Query() query: StudentManagementCardQueryRequestType,
  ) {
    return this.studentManagementCardService.listStudentManagementCard(query);
  }

  @ApiOperation({
    summary: '어드민 학생 관리 카드 조회',
    description: '어드민 학생 관리 카드 조회',
  })
  @ApiOkResponse({ type: GetStudentManagementCardResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Get('student-management-card-id/:studentManagementCardId')
  async getStudentManagementCardByIdForAdmin(
    @Param('studentManagementCardId') studentManagementCardId: number,
  ) {
    return await this.studentManagementCardService.getStudentManagementCardById(
      studentManagementCardId,
    );
  }

  @ApiOperation({
    summary: '어드민 학생 관리 카드 업데이트',
    description: '어드민 학생 관리 카드 업데이트',
  })
  @ApiOkResponse({ type: GetStudentManagementCardResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Put('student-management-card-id/:studentManagementCardId')
  async updateStudentManagementCard(
    @Param('studentManagementCardId') studentManagementCardId: number,
    @Body() studentManagementCardData: UpdateStudentManagementCardRequestType,
  ) {
    if (
      // 강의를 수정 하는 경우 아이디와 제목 모두 전달
      (studentManagementCardData.lectureName ||
        studentManagementCardData.lectureId) &&
      !(
        studentManagementCardData.lectureName &&
        studentManagementCardData.lectureId
      )
    ) {
      throw new BadRequestException(
        EStudentManagementCardErrorMessage.STUDENT_MANAGEMENT_CARD_INVALID_LECTURE_INPUT,
      );
    }

    return this.studentManagementCardService.updateStudentManagementCard(
      studentManagementCardId,
      { ...studentManagementCardData },
    );
  }

  // TODO(@jaesungahn): 필요시 주석 해제  date: 2023/08/24 9:26 PM
  // @ApiOperation({
  //   summary: '학생 관리 카드 메세지 전송',
  //   description: '학생 관리 카드 메세지 전송',
  // })
  // @ApiBearerAuth('authentication')
  // @UseGuards(AuthenticationGuard)
  // @UseGuards(
  //   UserRoleGuard([
  //     EAuthenticationUserRole.OWNER,
  //     EAuthenticationUserRole.ADMIN,
  //   ]),
  // )
  // @Post('/student-management-card/message')
  // async sendStudentManagementCardForAdmin(
  //   @Body() studentManagementCardData: SendStudentManagementCardRequestType,
  // ) {
  //   return this.studentManagementCardService.sendStudentManagementCardByIdForParent(
  //     studentManagementCardData.id,
  //   );
  // }
}
