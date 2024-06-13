import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  ELectureLevel,
  ELectureStatus,
  EStudentGrade,
  IsEnumString,
  PaginationQuery,
} from '@app/common';
import { IsPositiveInteger } from '@app/common/decorators/validation/integer.decorator';
import { CreateLectureTagRequestType } from './lecture-tag.request.type';
import { Type } from 'class-transformer';
import {
  CreateLectureThumbnailRequestType,
  UpdateLectureThumbnailRequestType,
} from './lecture-thumbnail.request.type';

export class LectureQueryRequestType extends PaginationQuery {
  @ApiProperty({ description: '강사 ID', required: false })
  @IsPositiveInteger()
  @IsOptional()
  teacherId?: number;

  @ApiProperty({
    description: '카테고리 IDs - 콤마(,) 로 구분',
    required: false,
    example: '1,2,3',
  })
  @IsString()
  @IsOptional()
  categoryIds?: string;

  @ApiProperty({ description: '이름', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '상태', required: false, enum: ELectureStatus })
  @IsString()
  @IsOptional()
  status?: ELectureStatus;

  @ApiProperty({ description: '난이도', required: false })
  @IsString()
  @IsOptional()
  level?: ELectureLevel;

  @ApiProperty({ description: '학습 단계', required: false })
  @IsString()
  @IsOptional()
  learningStage?: string;

  @ApiProperty({
    description: '수강 대상들',
    required: false,
    example: `${EStudentGrade.HIGH_1},${EStudentGrade.HIGH_2}`,
  })
  @IsString()
  @IsOptional()
  subjectGroups?: string;

  @ApiProperty({
    description: '복수 태그 이름 - 콤마(,) 로 구분',
    required: false,
  })
  @IsString()
  @IsOptional()
  tagNames?: string;
}

export class CreateLectureRequestType {
  @ApiProperty({ description: '강사 ID' })
  @IsPositiveInteger()
  teacherId: number;

  @ApiProperty({ description: '강사 ID' })
  @IsPositiveInteger()
  categoryId: number;

  @ApiProperty({ description: '교재 ID' })
  @IsPositiveInteger()
  textbookId: number;

  @ApiProperty({ description: '이름' })
  @IsString()
  name: string;

  @ApiProperty({
    description: '상태',
    enum: ELectureStatus,
  })
  @IsEnumString(ELectureStatus, '상태')
  @IsOptional()
  status?: ELectureStatus;

  @ApiProperty({ description: '난이도', enum: ELectureLevel })
  @IsEnumString(ELectureLevel, '난이도')
  level: ELectureLevel;

  @ApiProperty({ description: '학습 단계' })
  @IsString()
  learningStage: string;

  @ApiProperty({ description: '범위' })
  @IsString()
  scope: string;

  @ApiProperty({ description: '특징' })
  @IsString()
  feature: string;

  @ApiProperty({ description: '수강 대상', enum: EStudentGrade })
  @IsEnumString(EStudentGrade, '학년')
  subjectGroup: EStudentGrade;

  @ApiProperty({ description: '수강 대상 설명' })
  @IsString()
  subjectGroupDescription: string;

  @ApiProperty({ description: '설명' })
  @IsString()
  description: string;

  @ApiProperty({
    description: '태그',
    type: CreateLectureTagRequestType,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateLectureTagRequestType)
  @IsArray()
  @ArrayMaxSize(5)
  @ArrayNotEmpty()
  tags: CreateLectureTagRequestType[];

  @ApiProperty({
    description: '썸네일 이미지',
    type: CreateLectureThumbnailRequestType,
    isArray: true,
    nullable: true,
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateLectureThumbnailRequestType)
  @IsArray()
  @ArrayMaxSize(10)
  @ArrayNotEmpty()
  thumbnails?: CreateLectureThumbnailRequestType[];
}

export class UpdateLectureRequestType {
  @ApiProperty({
    description: '강사 ID',
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  teacherId?: number;

  @ApiProperty({
    description: '이름',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: '상태',
    enum: ELectureStatus,
    nullable: true,
  })
  @IsEnumString(ELectureStatus, '상태')
  @IsOptional()
  status?: ELectureStatus;

  @ApiProperty({ description: '난이도', enum: ELectureLevel, nullable: true })
  @IsEnumString(ELectureLevel, '난이도')
  @IsOptional()
  level?: ELectureLevel;

  @ApiProperty({
    description: '학습 단계',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  learningStage?: string;

  @ApiProperty({
    description: '범위',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  scope?: string;

  @ApiProperty({ description: '특징', nullable: true })
  @IsString()
  @IsOptional()
  feature?: string;

  @ApiProperty({
    description: '수강 대상',
    enum: EStudentGrade,
    nullable: true,
  })
  @IsEnumString(EStudentGrade, '학년')
  @IsOptional()
  subjectGroup?: EStudentGrade;

  @ApiProperty({ description: '수강 대상 설명', nullable: true })
  @IsString()
  @IsOptional()
  subjectGroupDescription?: string;

  @ApiProperty({
    description: '설명',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '썸네일 이미지',
    type: UpdateLectureThumbnailRequestType,
    isArray: true,
    nullable: true,
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateLectureThumbnailRequestType)
  @IsArray()
  @ArrayMaxSize(10)
  @ArrayNotEmpty()
  thumbnails?: UpdateLectureThumbnailRequestType[];
}
