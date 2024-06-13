import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ELectureStatus } from '@app/common';
import { LectureService } from '../../services';
import { GetLectureResponseType, LectureQueryRequestType } from '../../types';

@ApiTags('[Public] lecture')
@Controller({
  path: 'public/lectures',
})
export class PublicLectureController {
  constructor(private readonly lectureService: LectureService) {}

  @ApiOperation({
    summary: '강의 목록 조회',
    description: '강의 목록 조회',
  })
  @ApiOkResponse({ type: GetLectureResponseType })
  @Get()
  async listLecture(@Query() query: LectureQueryRequestType) {
    return this.lectureService.listLecture({
      ...query,
      status: ELectureStatus.ACTIVE,
    });
  }

  @ApiOperation({
    summary: '강의 조회',
    description: '강의 조회',
  })
  @ApiOkResponse({ type: GetLectureResponseType })
  @Get('lecture-id/:lectureId')
  async getLectureById(@Param('lectureId') lectureId: number) {
    return this.lectureService.getActiveLectureById(lectureId);
  }
}
