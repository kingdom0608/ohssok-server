import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';
import { ENoticeCategory, ENoticeStatus } from '@app/common/enums/notice';
import { PaginationQuery } from '@app/common';

export class CreateNoticeRequestType {
  @ApiProperty({ description: '공지사항 제목' })
  @IsString()
  @MaxLength(30)
  title: string;

  @ApiProperty({ description: '공지사항 내용' })
  @IsString()
  contents: string;

  @ApiProperty({ description: '카테고리', enum: ENoticeCategory })
  @MaxLength(30)
  category: ENoticeCategory;

  @ApiProperty({ description: '상태', enum: ENoticeStatus })
  @MaxLength(30)
  status: ENoticeStatus;

  @ApiProperty({
    description: '이미지 IDs',
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  imageIds?: string[];
}

export class UpdateNoticeRequestType {
  @ApiProperty({ description: '공지사항 제목', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  title?: string;

  @ApiProperty({ description: '공지사항 내용', required: false })
  @IsString()
  @IsOptional()
  contents?: string;

  @ApiProperty({
    description: '카테고리',
    enum: ENoticeCategory,
    required: false,
  })
  @IsOptional()
  @MaxLength(30)
  category?: ENoticeCategory;

  @ApiProperty({ description: '상태', enum: ENoticeStatus, required: false })
  @IsOptional()
  @MaxLength(30)
  status?: ENoticeStatus;

  @ApiProperty({
    description: '이미지 IDs',
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  imageIds?: string[];
}

export class NoticeQueryRequestType extends PaginationQuery {
  @ApiProperty({ description: '공지사항 제목', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: '공지사항 내용', required: false })
  @IsString()
  @IsOptional()
  contents?: string;

  @ApiProperty({
    description: '카테고리',
    enum: ENoticeCategory,
    required: false,
  })
  @IsOptional()
  @MaxLength(30)
  category?: ENoticeCategory;

  @ApiProperty({ description: '상태', enum: ENoticeStatus, required: false })
  @IsOptional()
  @MaxLength(30)
  status?: ENoticeStatus;
}
