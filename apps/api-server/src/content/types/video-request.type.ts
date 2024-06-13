import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import {
  ELectureStatus,
  EVideoStatus,
  EVideoTarget,
  EVideoUploadStatus,
  IsEnumString,
  PaginationQuery,
} from '@app/common';
export class MultipartModel {
  @ApiProperty({ description: 'part 태그' })
  @IsString()
  etag: string;

  @ApiProperty({ description: '업로드 순서' })
  @IsInt()
  partNumber: number;
}

export class VideoQueryRequestType extends PaginationQuery {
  @ApiProperty({ description: '아이디 (,)로 분리', required: false })
  @IsOptional()
  @IsString()
  videoId?: string;

  @ApiProperty({
    description: '업로드 상태',
    required: false,
    enum: ELectureStatus,
  })
  @IsString()
  @IsOptional()
  uploadStatus?: EVideoUploadStatus;
}

export class UpdateVideoForInternalRequestType {
  @ApiProperty({
    description: '상태',
    nullable: true,
    enum: EVideoStatus,
  })
  @IsString()
  @IsOptional()
  status?: EVideoStatus;

  @ApiProperty({
    description: '업로드 상태',
    nullable: true,
    enum: EVideoUploadStatus,
  })
  @IsString()
  @IsOptional()
  uploadStatus?: EVideoUploadStatus;
}

export class InitUploadVideoRequestType {
  @ApiProperty({ description: '파일명, 확장자 포함(현재 mp4 만 가능)' })
  @IsString()
  fileName: string;

  @ApiProperty({ description: '파일 사이즈(byte)' })
  @IsInt()
  fileSize: number;

  @ApiProperty({ description: '대상 도메인' })
  @IsEnumString(EVideoTarget, '대상 도메인 [LectureContent, ..]')
  target: string;
}

export class CreateUploadVideoPartUrlsRequestType {
  @ApiProperty({ description: '영상 아이디' })
  @IsInt()
  videoId: number;

  @ApiProperty({ description: '업로드 part 개수' })
  @IsInt()
  partNumbers: number;
}

export class CompleteUploadVideoRequestType {
  @ApiProperty({ description: '영상 아이디' })
  @IsInt()
  videoId: number;

  @ApiModelProperty({
    description: '파트 eTag 및 순서',
    type: MultipartModel,
    isArray: true,
  })
  @Type(() => MultipartModel)
  @ValidateNested()
  parts: MultipartModel[];
}

export class AbortUploadVideoPartRequestType {
  @ApiProperty({ description: '영상 아이디' })
  @IsInt()
  videoId: number;
}

export class UploadVideoPartRequestType {
  @ApiProperty({ description: '강의 컨텐츠 아이디' })
  @IsNumberString()
  videoId: number;

  @ApiProperty({ description: '업로드 순서' })
  @IsNumberString()
  partNumber: number;

  @ApiProperty({
    description: '파일 목록',
    format: 'binary',
    required: true,
  })
  readonly file?: Express.Multer.File[];
}
