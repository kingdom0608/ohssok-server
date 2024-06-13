import { ApiProperty } from '@nestjs/swagger';
import { ELectureLevel, ELectureStatus } from '@app/common';
import { GetTeacherResponseType } from './teacher-response.type';
import { GetCategoryResponseType } from './category-response.type';
import { GetLectureTagResponseType } from './lecture-tag.response.type';
import { GetTextbookResponseType } from './textbook-response.type';

export class GetLectureResponseType {
  @ApiProperty({ description: 'ID' })
  id: number;

  @ApiProperty({
    description: '상태',
    enum: ELectureStatus,
  })
  status?: ELectureStatus;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '난이도' })
  level: ELectureLevel;

  @ApiProperty({ description: '학습 단계' })
  learningStage: string;

  @ApiProperty({ description: '범위' })
  scope: string;

  @ApiProperty({ description: '설명' })
  description: string;

  @ApiProperty({ description: '수강 대상' })
  subjectGroup: string;

  @ApiProperty({ description: '생성 일자' })
  createDate: Date;

  @ApiProperty({ description: '수정 일자' })
  updateDate: Date;

  @ApiProperty({
    description: '강사',
    type: GetTeacherResponseType,
    required: true,
  })
  teacher: GetTeacherResponseType;

  @ApiProperty({
    description: '카테고리',
    type: GetCategoryResponseType,
    required: true,
  })
  category: GetCategoryResponseType;

  @ApiProperty({
    description: '교재',
    type: GetTextbookResponseType,
    required: true,
  })
  textbook: GetTextbookResponseType;

  @ApiProperty({
    description: '태그',
    type: GetLectureTagResponseType,
    required: true,
  })
  tags: GetLectureTagResponseType;
}
