import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { EVideoStatus, EVideoUploadStatus } from '@app/common';

export class GetVideoResponseType {
  @ApiProperty({ description: 'ID' })
  readonly id: number;

  @ApiProperty({ description: '파일명' })
  @IsString()
  fileName: string;

  @ApiProperty({ description: '파일 사이즈' })
  @IsInt()
  fileSize: number;

  @ApiProperty({ description: '활성 여부 상태', enum: EVideoStatus })
  @IsString()
  status: EVideoStatus;

  @ApiProperty({ description: '업로드 상태', enum: EVideoUploadStatus })
  @IsString()
  uploadStatus: EVideoUploadStatus;

  @ApiProperty({ description: '영상 code' })
  @IsString()
  code: string;

  @ApiProperty({ description: '영상 key' })
  @IsString()
  key: string;

  @ApiProperty({ description: '생성 일자' })
  readonly createDate: Date;

  @ApiProperty({ description: '변경 일자' })
  readonly updateDate: Date;
}

export class CreateUploadVideoPartUrlsResponseType {
  @ApiProperty({ description: '업로드 url' })
  uploadUrl: string;

  @ApiProperty({ description: '업로드 순서' })
  partNumber: string;
}

export class InitUploadVideoResponseType {
  @ApiProperty({ description: '업로드 id' })
  @IsString()
  uploadId: string;
}

export class UploadVideoPartResponseType {
  @ApiProperty({ description: '업로드 id' })
  etag: string;
}
