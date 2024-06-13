import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  DOMAINS,
  EVideoErrorMessageEnum,
  EVideoUploadStatus,
  S3Service,
} from '@app/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticationGuard,
  EAuthenticationUserRole,
  UserRoleGuard,
} from '@app/authentication';
import { VideoService } from '../../services';
import {
  AbortUploadVideoPartRequestType,
  CompleteUploadVideoRequestType,
  CreateUploadVideoPartUrlsRequestType,
  InitUploadVideoRequestType,
  UploadVideoPartRequestType,
  VideoQueryRequestType,
} from '../../types';
import {
  CreateUploadVideoPartUrlsResponseType,
  GetVideoResponseType,
  UploadVideoPartResponseType,
} from '../../types/video-response.type';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('[Admin] video')
@Controller({
  path: 'admin/videos',
})
export class AdminVideoController {
  private readonly privateBucket;
  constructor(
    @InjectDataSource(DOMAINS.Content)
    private dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
    private readonly videoService: VideoService,
  ) {
    this.privateBucket = this.configService.get<string>(
      'AWS_S3_PRIVATE_BUCKET',
    );
  }

  @ApiOperation({
    summary: '비디오 업로드 시작 - 업로드 아이디 발급',
    description: '비디오 업로드 시작',
  })
  @ApiOkResponse({ type: GetVideoResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Post('video/init')
  async initUploadVideo(@Body() videoData: InitUploadVideoRequestType) {
    if (/[`~!@#$%^&*|\\\'\";:\/?]/gi.test(videoData.fileName)) {
      throw new BadRequestException(
        EVideoErrorMessageEnum.VIDEO_BAD_REQUEST_FILE_NAME,
      );
    }

    if (!/\.(mp4)$/i.test(videoData.fileName)) {
      throw new BadRequestException(
        EVideoErrorMessageEnum.VIDEO_BAD_REQUEST_INVALID_IMAGE_FILE_EXTENSION,
      );
    }

    const video = await this.videoService.createVideo({
      fileName: videoData.fileName,
      fileSize: videoData.fileSize,
      target: videoData.target,
    });

    const uploadId = await this.s3Service.createMultipartUploadId({
      bucket: this.privateBucket,
      key: video.key,
    });

    await this.videoService.updateVideoById(video.id, {
      uploadStatus: EVideoUploadStatus.PENDING,
      uploadId: uploadId,
    });

    return this.videoService.getVideoById(video.id);
  }

  @ApiOperation({
    summary: '영상 부분 업로드',
    description: '',
  })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 1 }]))
  @ApiOkResponse({ type: UploadVideoPartResponseType })
  @Post('video/part')
  async uploadLectureContentVideoPart(
    @Body() videoData: UploadVideoPartRequestType,
    @UploadedFiles() upload: ParameterDecorator,
  ) {
    const video = await this.videoService.getVideoById(videoData.videoId);
    const bucket = this.privateBucket;

    const videos: Express.Multer.File[] = upload['file'] || [];

    const etag = await this.s3Service.uploadMultipartChunk({
      file: videos[0].buffer,
      uploadId: video.uploadId,
      partNumber: videoData.partNumber,
      bucket: bucket,
      key: video.key,
    });
    return {
      etag: etag,
    };
  }

  @ApiOperation({
    summary: '영상 부분 업로드 url 발급',
    description: '영상 부분 업로드 url 발급',
  })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @ApiOkResponse({ type: CreateUploadVideoPartUrlsResponseType })
  @Post('video/part-urls')
  async createUploadLectureContentVideoPartUrls(
    @Body() uploadVideoData: CreateUploadVideoPartUrlsRequestType,
  ) {
    const video = await this.videoService.getVideoById(uploadVideoData.videoId);

    if (!video.uploadId) {
      throw new BadRequestException(
        EVideoErrorMessageEnum.VIDEO_BAD_REQUEST_NOT_STARTED,
      );
    }

    const partPromises = [];
    for (let i = 1; i <= uploadVideoData.partNumbers; i++) {
      partPromises.push(
        this.s3Service.getMultipartPartUploadSignUrl({
          uploadId: video.uploadId,
          partNumber: i,
          bucket: this.privateBucket,
          key: video.key,
        }),
      );
    }

    const signedUrls = await Promise.all(partPromises);

    return {
      list: signedUrls.map((url, index) => {
        return {
          uploadUrl: url,
          partNumber: index + 1,
        };
      }),
    };
  }

  @ApiOperation({
    summary: '영상 업로드 완료 처리',
    description: '영상 업로드 완료 처리',
  })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Post('video/complete')
  async completeUploadLectureContentVideo(
    @Body()
    completeData: CompleteUploadVideoRequestType,
  ) {
    /** 강의 컨텐츠 조회 */
    const video = await this.videoService.getVideoById(completeData.videoId);

    if (!video.uploadId) {
      throw new BadRequestException(
        EVideoErrorMessageEnum.VIDEO_BAD_REQUEST_NOT_STARTED,
      );
    }

    await this.s3Service.completeUploadMultipart({
      bucket: this.privateBucket,
      key: video.key,
      parts: completeData.parts,
      uploadId: video.uploadId,
    });

    await this.videoService.updateVideoById(completeData.videoId, {
      uploadStatus: EVideoUploadStatus.COMPLETED,
    });

    const signedUrl: string = await this.s3Service.getSignUrl({
      bucket: this.privateBucket,
      key: video.key,
    });

    return {
      bucket: this.privateBucket,
      key: video.key,
      url: signedUrl,
    };
  }

  @ApiOperation({
    summary: '영상 업로드 취소',
    description: '영상 업로드 취소',
  })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Post('video/abort')
  async abortUploadLectureContentVideo(
    @Body() abortData: AbortUploadVideoPartRequestType,
  ) {
    /** 강의 컨텐츠 조회 */
    const video = await this.videoService.getVideoById(abortData.videoId);

    if (!video.uploadId) {
      throw new BadRequestException(
        EVideoErrorMessageEnum.VIDEO_BAD_REQUEST_NOT_STARTED,
      );
    }
    //  취소 성공 시 success 반환
    await this.s3Service.abortMultipartUpload({
      bucket: this.privateBucket,
      key: video.key,
      uploadId: video.uploadId,
    });

    await this.videoService.updateVideoById(abortData.videoId, {
      uploadStatus: EVideoUploadStatus.ABORTED,
    });

    return {
      result: 'success',
    };
  }

  @ApiOperation({
    summary: '영상 목록 조회',
    description: '영상 목록 조회',
  })
  @ApiOkResponse({ type: [GetVideoResponseType] })
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
  async listStudentForAdmin(@Query() query: VideoQueryRequestType) {
    return this.videoService.listVideo(query);
  }
}
