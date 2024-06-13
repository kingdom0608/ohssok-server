import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { NoticeService } from '../../services';
import { GetNoticeResponseType, NoticeQueryRequestType } from '../../types';
import { ENoticeStatus } from '@app/common/enums/notice';

@ApiTags('[Public] Operator')
@Controller({
  path: 'public/operators',
})
export class PublicOperatorController {
  constructor(private readonly noticeService: NoticeService) {}

  @ApiOperation({
    summary: '공지사항 목록 조회',
    description: '공지사항 목록 조회',
  })
  @ApiOkResponse({ type: GetNoticeResponseType })
  @Get()
  async listNotice(@Query() query: NoticeQueryRequestType) {
    query.status = ENoticeStatus.ACTIVE;
    return this.noticeService.listNotice(query);
  }

  @ApiOperation({
    summary: '공지사항 단일 조회',
    description: '공지사항 단일 조회',
  })
  @ApiOkResponse({ type: GetNoticeResponseType })
  @Get('notice-id/:noticeId')
  async getNoticeById(@Param('noticeId') noticeId: number) {
    return this.noticeService.getActiveNoticeById(noticeId);
  }
}
