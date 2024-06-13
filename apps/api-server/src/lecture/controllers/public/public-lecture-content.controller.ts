import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import {
  GetLectureContentResponseType,
  LectureContentQueryRequestType,
} from '../../types';
import { LectureContentService } from '../../services';
import { ELectureContentStatus, EVideoUploadStatus } from '@app/common';

@ApiTags('[Public] lecture')
@Controller({
  path: 'public/lecture-contents',
})
export class PublicLectureContentController {
  constructor(private readonly lectureContentService: LectureContentService) {}

  @ApiOperation({
    summary: '강의 컨텐츠 조회',
    description: '강의 컨텐츠 조회',
  })
  @ApiOkResponse({ type: GetLectureContentResponseType })
  @Get()
  async listLectureContent(@Query() query: LectureContentQueryRequestType) {
    return await this.lectureContentService.listLectureContent({
      ...query,
      status: ELectureContentStatus.ACTIVE,
      uploadStatus: EVideoUploadStatus.COMPLETED,
    });
  }
}
