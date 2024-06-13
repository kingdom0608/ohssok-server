import { ApiProperty } from '@nestjs/swagger';
import { EBannerPlatform, EBannerStatus } from '@app/common/enums/banner';
import {
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PaginationQuery } from '@app/common';

export class CreateBannerRequestType {
  @ApiProperty({ description: 'slotId' })
  @IsNumberString()
  slotId: number;

  @ApiProperty({ description: '노출 순서' })
  @IsNumberString()
  sequence: number;

  @ApiProperty({ description: '연결된 링크 Url', required: false })
  @IsString()
  url?: string;

  @ApiProperty({ description: '배너 제목' })
  @MaxLength(50)
  title: string;

  @ApiProperty({ description: '배너 상세 설명', required: false })
  @IsString()
  @MaxLength(50)
  description?: string;

  @ApiProperty({ description: '표시 플랫폼', enum: EBannerPlatform })
  @MaxLength(50)
  platform: EBannerPlatform;

  @ApiProperty({ description: '상태', enum: EBannerStatus })
  status: EBannerStatus;

  @ApiProperty({
    description: '파일 목록',
    format: 'binary',
  })
  readonly files: Express.Multer.File[];
}

export class UpdateBannerRequestType {
  @ApiProperty({ description: 'slotId', required: false })
  @IsOptional()
  @IsNumberString()
  slotId?: number;

  @ApiProperty({ description: '노출 순서', required: false })
  @IsOptional()
  @IsNumberString()
  sequence?: number;

  @ApiProperty({ description: '연결된 링크 Url', required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ description: '배너 제목', required: false })
  @IsOptional()
  @MaxLength(50)
  title?: string;

  @ApiProperty({ description: '배너 상세 설명', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  description?: string;

  @ApiProperty({
    description: '표시 플랫폼',
    enum: EBannerPlatform,
    required: false,
  })
  @IsOptional()
  @MaxLength(50)
  platform?: EBannerPlatform;

  @ApiProperty({ description: '이미지 Url', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: '상태', enum: EBannerStatus, required: false })
  @IsOptional()
  status?: EBannerStatus;

  @ApiProperty({
    description: '파일 목록',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  readonly files?: Express.Multer.File[];
}

export class BannerQueryRequestType extends PaginationQuery {
  @ApiProperty({ description: '슬롯 아이디', required: false })
  @IsInt()
  @IsOptional()
  slotId?: number;
}
