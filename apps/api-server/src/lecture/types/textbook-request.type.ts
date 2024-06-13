import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ETextbookStatus, PaginationQuery } from '@app/common';
import { IsPositiveInteger } from '@app/common/decorators/validation/integer.decorator';

export class CreateTextbookRequestType {
  @ApiProperty({ description: '이미지 ID' })
  @IsPositiveInteger()
  imageId: number;

  @ApiProperty({ description: '이미지 URL' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ description: '이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '저자' })
  @IsString()
  author: string;

  @ApiProperty({ description: '페이지' })
  @IsString()
  page: string;

  @ApiProperty({ description: '페이지' })
  @IsString()
  size: string;

  @ApiProperty({ description: '설명' })
  @IsString()
  description: string;

  @ApiProperty({ description: '출간 일자' })
  @IsDateString()
  publishDate: Date;
}

export class UpdateTextbookRequestType {
  @ApiProperty({ description: '이미지 ID', nullable: true })
  @IsPositiveInteger()
  @IsOptional()
  imageId?: number;

  @ApiProperty({ description: '이미지 URL', nullable: true })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: '이름', nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '상태', enum: ETextbookStatus, nullable: true })
  @IsEnum(ETextbookStatus)
  @IsOptional()
  status?: ETextbookStatus;

  @ApiProperty({ description: '저자', nullable: true })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty({ description: '페이지', nullable: true })
  @IsString()
  @IsOptional()
  page?: string;

  @ApiProperty({ description: '페이지', nullable: true })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty({ description: '설명', nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '출간 일자', nullable: true })
  @IsDateString()
  @IsOptional()
  publishDate?: Date;
}

export class TextbookQueryRequestType extends PaginationQuery {
  @ApiProperty({ description: '이름', required: false })
  @IsString()
  @IsOptional()
  name?: string;
}
