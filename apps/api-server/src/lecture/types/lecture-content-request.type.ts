import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IsPositiveInteger } from '@app/common/decorators/validation/integer.decorator';
import {
  ELectureContentStatus,
  EVideoUploadStatus,
  PaginationQuery,
} from '@app/common';

export class LectureContentQueryRequestType extends PaginationQuery {
  @ApiProperty({ description: '강의 아이디' })
  @IsOptional()
  @IsPositiveInteger()
  lectureId?: number;

  @ApiProperty({
    description: '상태',
    required: false,
    enum: ELectureContentStatus,
  })
  @IsString()
  @IsOptional()
  status?: ELectureContentStatus;

  uploadStatus?: EVideoUploadStatus;
}

export class CreateLectureContentRequestType {
  @ApiProperty({ description: '강의 아이디' })
  @IsPositiveInteger()
  lectureId: number;

  @ApiProperty({ description: '영상 아이디', nullable: true })
  @IsOptional()
  @IsPositiveInteger()
  videoId?: number;

  @ApiProperty({ description: '노출 순서' })
  @IsPositiveInteger()
  sequence: number;

  @ApiProperty({ description: '이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '상세 이름' })
  @IsString()
  @IsOptional()
  subName?: string;

  @ApiProperty({ description: '내용' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: '시간', example: '01:30:30' })
  @IsString()
  time: string;

  @ApiProperty({ description: '페이지', required: false })
  @IsString()
  @IsOptional()
  page?: string;
}

export class UpdateLectureContentRequestType {
  @ApiProperty({ description: '노출 순서', required: false, nullable: true })
  @IsOptional()
  @IsPositiveInteger()
  sequence?: number;

  @ApiProperty({ description: '이름', required: false, nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '상세 이름' })
  @IsString()
  @IsOptional()
  subName?: string;

  @ApiProperty({ description: '내용' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: '시간',
    required: false,
    nullable: true,
    example: '01:30:30',
  })
  @IsString()
  @IsOptional()
  time?: string;

  @ApiProperty({ description: '페이지', required: false, nullable: true })
  @IsString()
  @IsOptional()
  page?: string;

  @ApiProperty({ description: '영상 아이디', required: false, nullable: true })
  @IsPositiveInteger()
  videoId?: number;
}
