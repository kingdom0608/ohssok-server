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
  CreateStudentManagementCardDetailRequestType,
  SendStudentManagementCardDetailRequestType,
  StudentManagementCardDetailQueryRequestType,
  UpdateStudentManagementCardDetailRequestType,
  GetStudentManagementCardDetailResponseType,
} from '../../types';
import {
  StudentManagementCardDetailService,
  StudentManagementCardService,
} from '../../services';

@ApiTags('[Admin] student')
@Controller({
  path: 'admin/student-management-card-details',
})
export class AdminStudentManagementCardDetailController {
  constructor(
    private readonly studentManagementCardService: StudentManagementCardService,
    private readonly studentManagementCardDetailService: StudentManagementCardDetailService,
  ) {}

  @ApiOperation({
    summary: '어드민 학생 관리 카드 상세 생성',
    description: '어드민 학생 관리 카드 상세 생성',
  })
  @ApiOkResponse({ type: GetStudentManagementCardDetailResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Post('/student-management-card-detail')
  async createStudentManagementCardDetailForAdmin(
    @Body()
    studentManagementCardDetailData: CreateStudentManagementCardDetailRequestType,
  ) {
    return this.studentManagementCardDetailService.createStudentManagementCardDetail(
      studentManagementCardDetailData,
    );
  }

  @ApiOperation({
    summary: '어드민 학생 관리 카드 상세 목록 조회',
    description: '어드민 학생 관리 카드 상세 목록 조회',
  })
  @ApiOkResponse({ type: [GetStudentManagementCardDetailResponseType] })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Get('')
  async listStudentManagementCardDetailForAdmin(
    @Query() query: StudentManagementCardDetailQueryRequestType,
  ) {
    await this.studentManagementCardService.getStudentManagementCardById(
      query.studentManagementCardId,
    );

    return await this.studentManagementCardDetailService.listStudentManagementCardDetail(
      {
        ...query,
      },
    );
  }

  @ApiOperation({
    summary: '학생 관리 카드 상세 조회',
    description: '학생 관리 카드 상세 조회',
  })
  @ApiOkResponse({ type: GetStudentManagementCardDetailResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @Get('student-management-card-detail-id/:studentManagementCardDetailId')
  async getStudentManagementCardDetailForAdmin(
    @Param('studentManagementCardDetailId')
    studentManagementCardDetailId: number,
  ) {
    return this.studentManagementCardDetailService.getStudentManagementCardDetailById(
      studentManagementCardDetailId,
    );
  }

  @ApiOperation({
    summary: '어드민 학생 관리 카드 상세 수정',
    description: '어드민 학생 관리 카드 상세 수정',
  })
  @ApiOkResponse({ type: GetStudentManagementCardDetailResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Put('student-management-card-detail-id/:studentManagementCardDetailId')
  async updateStudentManagementCardDetailForAdmin(
    @Param('studentManagementCardDetailId')
    studentManagementCardDetailId: number,
    @Body()
    studentManagementCardDetailData: UpdateStudentManagementCardDetailRequestType,
  ) {
    return this.studentManagementCardDetailService.updateStudentManagementCardDetail(
      studentManagementCardDetailId,
      {
        ...studentManagementCardDetailData,
      },
    );
  }

  @ApiOperation({
    summary: '어드민 학생 관리 카드 상세 메세지 전송',
    description: '어드민 학생 관리 카드 상세 메세지 전송',
  })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
    ]),
  )
  @Post('/student-management-card-detail/message')
  async sendStudentManagementCardDetailForAdmin(
    @Body()
    studentManagementCardDetailData: SendStudentManagementCardDetailRequestType,
  ) {
    return this.studentManagementCardDetailService.sendStudentManagementCardDetailForParent(
      studentManagementCardDetailData.id,
    );
  }
}
