import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticationGuard, CurrentUser } from '@app/authentication';
import { StudentManagementCardService } from '../../services';
import {
  GetStudentManagementCardResponseType,
  StudentManagementCardQueryRequestType,
} from '../../types';

@ApiTags('[Public] student')
@Controller({
  path: 'public/student-management-cards',
})
export class PublicStudentManagementCardController {
  constructor(
    private readonly studentManagementCardService: StudentManagementCardService,
  ) {}

  @ApiOperation({
    summary: '학생 관리 카드 목록 조회',
    description: '학생 관리 카드 목록 조회',
  })
  @ApiOkResponse({ type: GetStudentManagementCardResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @Get()
  async listStudentManagementCard(
    @CurrentUser() currentUser,
    @Query() query: StudentManagementCardQueryRequestType,
  ) {
    query.userId = currentUser.id;
    return this.studentManagementCardService.listStudentManagementCard(query);
  }

  @ApiOperation({
    summary: '학생 관리 카드 조회',
    description: '학생 관리 카드 조회',
  })
  @ApiOkResponse({ type: GetStudentManagementCardResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @Get('student-management-card-id/:studentManagementCardId')
  async getStudentManagementCardById(
    @CurrentUser() currentUser,
    @Param('studentManagementCardId') studentManagementCardId: number,
  ) {
    return await this.studentManagementCardService.getStudentManagementCardByIdUserId(
      studentManagementCardId,
      currentUser.userId,
    );
  }
}
