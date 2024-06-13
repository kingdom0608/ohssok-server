import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { VideoService } from '../../services';
import { GetVideoResponseType } from '../../types';
import {
  UpdateVideoForInternalRequestType,
  VideoQueryRequestType,
} from '../../types';
import { GetStudentResponseType } from '../../../student/types';

@ApiTags('[Internal] video')
@Controller({
  path: 'internal/videos',
})
export class InternalVideoController {
  constructor(private readonly videoService: VideoService) {}

  @ApiOperation({
    summary: '영상 목록 조회',
    description: '영상 목록 조회',
  })
  @ApiOkResponse({ type: [GetVideoResponseType] })
  @ApiBearerAuth('authentication')
  @Get()
  async listStudentForInternal(@Query() query: VideoQueryRequestType) {
    return this.videoService.listVideo(query);
  }

  @ApiOperation({
    summary: '인터널 영상 수정',
    description: '인터널 영상 수정',
  })
  @ApiOkResponse({ type: GetStudentResponseType })
  @Put('video-id/:videoId')
  async updateVideoForInternal(
    @Param('videoId') videoId: number,
    @Body() updateVideoData: UpdateVideoForInternalRequestType,
  ) {
    return this.videoService.updateVideoById(videoId, {
      ...updateVideoData,
    });
  }
}
