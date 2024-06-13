import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { VideoService } from '../../services';
import { InjectDataSource } from '@nestjs/typeorm';
import { DOMAINS } from '@app/common';
import { DataSource } from 'typeorm';
import {
  AuthenticationGuard,
  EAuthenticationUserRole,
  UserRoleGuard,
} from '@app/authentication';
import { GetVideoResponseType } from '../../types/video-response.type';

@ApiTags('[Public] video')
@Controller({
  path: 'public/videos',
})
export class PublicVideoController {
  constructor(
    @InjectDataSource(DOMAINS.Content)
    private dataSource: DataSource,
    private readonly videoService: VideoService,
  ) {}

  @ApiOperation({
    summary: '영상 조회',
    description: '영상 조회',
  })
  @ApiOkResponse({ type: GetVideoResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.STUDENT,
      EAuthenticationUserRole.PARENTS,
      EAuthenticationUserRole.TEACHER,
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
    ]),
  )
  @Get('video/video-id/:videoId')
  async getVideoById(@Param('videoId') videoId: number) {
    const video = await this.videoService.getCompletedVideoById(videoId);

    return {
      key: video.key.replace('.mp4', '.m3u8'),
    };
  }
}
