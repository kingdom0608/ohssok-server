import { EImageStatus, EImageTarget, IsEnumString } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateImageUploadUrlRequestType {
  @ApiProperty({ description: '파일명, 확장자 미포함' })
  @IsString()
  @MaxLength(100)
  originalFileName: string;

  @ApiProperty({ description: '파일 사이즈(byte)' })
  @IsInt()
  fileSize: number;

  @ApiProperty({ description: '확장자' })
  @IsString()
  @MaxLength(100)
  extension: string;

  @ApiProperty({ description: '대상 도메인' })
  @IsEnumString(EImageTarget, '대상 도메인 [NOTICE_CONTENT, ..]')
  @MaxLength(50)
  @IsOptional()
  target?: EImageTarget;
}

export class UploadImageRequestType {
  @ApiProperty({ description: '파일명, 확장자 미포함' })
  @IsString()
  @MaxLength(100)
  originalFileName: string;

  @ApiProperty({ description: '파일 사이즈(byte)' })
  @IsNumberString()
  fileSize: number;

  @ApiProperty({ description: '확장자' })
  @IsString()
  @MaxLength(100)
  extension: string;

  @ApiProperty({ description: '대상 도메인' })
  @IsEnumString(EImageTarget, '대상 도메인 [NOTICE_CONTENT, ..]')
  @IsOptional()
  @MaxLength(50)
  target?: string;

  @ApiProperty({
    description: '파일 목록',
    format: 'binary',
    required: true,
  })
  readonly file?: Express.Multer.File[];
}

export class UpdateImagesForInternalRequestType {
  @ApiProperty({
    description: '상태',
    nullable: true,
    enum: EImageStatus,
  })
  @IsString()
  status: EImageStatus;
}
