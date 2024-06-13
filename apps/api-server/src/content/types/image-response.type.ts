import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { EImageStatus, EImageTarget, EVideoStatus } from '@app/common';

export class GetImageResponseType {
  @ApiProperty({ description: 'ID' })
  readonly id: number;

  @ApiProperty({ description: '업로드 파일명' })
  @IsString()
  fileName: string;

  @ApiProperty({ description: '파일명' })
  @IsString()
  originalFileName: string;

  @ApiProperty({ description: '파일 사이즈' })
  @IsInt()
  fileSize: number;

  @ApiProperty({ description: '확장자' })
  @IsString()
  extension: string;

  @ApiProperty({ description: '활성 여부 상태', enum: EImageStatus })
  @IsString()
  status: EVideoStatus;

  @ApiProperty({ description: '이미지 key' })
  @IsString()
  key: string;

  @ApiProperty({ description: '대상 도메인', enum: EImageTarget })
  @IsString()
  target: EImageTarget;

  @ApiProperty({ description: '이미지 조회 Url' })
  @IsString()
  url: string;

  @ApiProperty({ description: '생성 일자' })
  readonly createDate: Date;

  @ApiProperty({ description: '변경 일자' })
  readonly updateDate: Date;
}

export class UploadImageResponseType {
  @ApiProperty({ description: 'S3 업로드 url' })
  url: string;
}

export class CreateImageUploadUrlResponseType {
  @ApiProperty({ description: 'ID' })
  readonly id: number;

  @ApiProperty({ description: '업로드 url' })
  uploadUrl: string;

  @ApiProperty({ description: '업로드 파일 이름' })
  fileName: string;
}
