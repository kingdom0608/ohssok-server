import { ApiProperty } from '@nestjs/swagger';
import { EStudentGrade } from '@app/common';
import { GetUserResponseType } from '../../user';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class GetStudentResponseType {
  @ApiProperty({ description: 'ID' })
  readonly id: number;

  @ApiProperty({
    description: '사용자 ID',
  })
  userId: number;

  @ApiProperty({
    description: '이름',
  })
  name: string;

  @ApiProperty({
    description: '학교 이름',
  })
  schoolName?: string;

  @ApiProperty({
    description: '학생 학년',
    enum: EStudentGrade,
  })
  grade: EStudentGrade;

  @ApiProperty({
    description: '내신 평균 점수',
  })
  internalExamAverageScore?: number;

  @ApiProperty({
    description: '모의고사 평균 등급',
  })
  mockExamAverageScore?: number;

  @ApiProperty({
    description: '학생',
    type: GetUserResponseType,
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => GetUserResponseType)
  user: GetUserResponseType;

  @ApiProperty({ description: '생성 일자' })
  readonly createDate: Date;

  @ApiProperty({ description: '변경 일자' })
  readonly updateDate: Date;
}
