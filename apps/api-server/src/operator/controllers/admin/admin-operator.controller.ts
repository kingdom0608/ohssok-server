import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NoticeService } from '../../services';
import {
  CreateNoticeRequestType,
  GetNoticeResponseType,
  NoticeQueryRequestType,
  UpdateNoticeRequestType,
} from '../../types';
import {
  AuthenticationGuard,
  EAuthenticationUserRole,
  UserRoleGuard,
} from '@app/authentication';

@ApiTags('[Admin] Operator')
@Controller({
  path: 'admin/operators',
})
export class AdminOperatorController {
  constructor(private readonly noticeService: NoticeService) {}

  @ApiOperation({
    summary: '공지사항 생성',
    description: '공지사항 생성',
  })
  @ApiOkResponse({ type: GetNoticeResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
    ]),
  )
  @Post('notice')
  async createNoticeForAdmin(@Body() noticeData: CreateNoticeRequestType) {
    return this.noticeService.createNotice(noticeData);
  }

  @ApiOperation({
    summary: '공지사항 목록 조회',
    description: '공지사항 목록 조회',
  })
  @ApiOkResponse({ type: GetNoticeResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
    ]),
  )
  @Get()
  async listNoticeForAdmin(@Query() query: NoticeQueryRequestType) {
    return this.noticeService.listNotice(query);
  }

  @ApiOperation({
    summary: '공지사항 단일 조회',
    description: '공지사항 단일 조회',
  })
  @ApiOkResponse({ type: GetNoticeResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
    ]),
  )
  @Get('notice-id/:noticeId')
  async getNoticeByIdForAdmin(@Param('noticeId') noticeId: number) {
    return this.noticeService.getNoticeById(noticeId);
  }

  @ApiOperation({
    summary: '공지사항 수정',
    description: '공지사항 수정',
  })
  @ApiOkResponse({ type: GetNoticeResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
    ]),
  )
  @Put('notice-id/:noticeId')
  async updateNoticeByIdForAdmin(
    @Param('noticeId') noticeId: number,
    @Body() updateNoticeData: UpdateNoticeRequestType,
  ) {
    return this.noticeService.updateNoticeById(noticeId, {
      ...updateNoticeData,
    });
  }

  @ApiOperation({
    summary: '공지사항 삭제',
    description: '공지사항 삭제',
  })
  @ApiOkResponse({ type: GetNoticeResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
    ]),
  )
  @Delete('notice-id/:noticeId')
  async deleteBannerByIdForAdmin(@Param('noticeId') noticeId: number) {
    return await this.noticeService.deleteNoticeById(noticeId);
  }
}
