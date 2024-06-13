import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthenticationGuard, CurrentUser } from '@app/authentication';
import {
  StudentManagementCardDetailService,
  StudentManagementCardService,
} from '../../services';
import {
  GetStudentManagementCardDetailResponseType,
  StudentManagementCardDetailQueryRequestType,
} from '../../types';

@ApiTags('[Public] student')
@Controller({
  path: 'public/student-management-card-details',
})
export class PublicStudentManagementCardDetailController {
  constructor(
    private readonly studentManagementCardService: StudentManagementCardService,
    private readonly studentManagementCardDetailService: StudentManagementCardDetailService,
  ) {}

  @ApiOperation({
    summary: '학생 관리 카드 상세 목록 조회',
    description: '학생 관리 카드 상세 목록 조회',
  })
  @ApiOkResponse({ type: [GetStudentManagementCardDetailResponseType] })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @Get()
  async listStudentManagementCardDetail(
    @CurrentUser() currentUser,
    @Query() query: StudentManagementCardDetailQueryRequestType,
  ) {
    await this.studentManagementCardService.getStudentManagementCardByIdUserId(
      query.studentManagementCardId,
      currentUser.id,
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
  async getStudentManagementCardDetail(
    @CurrentUser() currentUser,
    @Param('studentManagementCardDetailId')
    studentManagementCardDetailId: number,
  ) {
    return this.studentManagementCardDetailService.getStudentManagementCardDetailByIdUserId(
      studentManagementCardDetailId,
      currentUser.id,
    );
  }

  @ApiOperation({
    summary: '학생 관리 카드 상세 코드-주차 조회',
    description: '학생 관리 카드 상세 코드-주차 조회',
  })
  @ApiOkResponse({ type: GetStudentManagementCardDetailResponseType })
  @Get(
    'student-management-card-detail-code-week/:studentManagementCardDetailCodeWeek',
  )
  async getStudentManagementCardDetailByCodeWeek(
    @Param('studentManagementCardDetailCodeWeek')
    studentManagementCardDetailCodeWeek: string,
  ) {
    return this.studentManagementCardDetailService.getStudentManagementCardDetailByCodeWeek(
      studentManagementCardDetailCodeWeek,
    );
  }
}
