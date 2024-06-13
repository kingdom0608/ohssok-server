import { EStudentGrade, PaginationQuery } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateStudentRequestType {
  @ApiProperty({
    description: '유저 ID',
  })
  @IsInt()
  userId?: number;

  @ApiProperty({
    description: '학생 이름',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '전화번호',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: '부모 전화번호',
    required: false,
  })
  @IsString()
  parentPhoneNumber?: string;

  @ApiProperty({
    description: '생일',
  })
  birthday: Date;

  @ApiProperty({
    description: '학교 이름',
    required: false,
  })
  @IsString()
  @IsOptional()
  schoolName?: string;

  @ApiProperty({
    description: '학생 학년',
    enum: EStudentGrade,
  })
  grade: EStudentGrade;

  @ApiProperty({
    description: '내신 평균 점수',
  })
  @IsInt()
  @IsOptional()
  internalExamAverageScore?: number;

  @ApiProperty({
    description: '모의고사 평균 등급',
  })
  @IsInt()
  @IsOptional()
  mockExamAverageScore?: number;
}

export class UpdateStudentRequestType {
  @ApiProperty({
    description: '부모 전화번호',
    required: false,
  })
  @IsString()
  parentPhoneNumber?: string;

  @ApiProperty({
    description: '학교 이름',
    required: false,
  })
  @IsString()
  @IsOptional()
  schoolName?: string;

  @ApiProperty({
    description: '학생 학년',
    enum: EStudentGrade,
    required: false,
  })
  grade: EStudentGrade;

  @ApiProperty({
    description: '내신 평균 점수',
    required: false,
  })
  @IsInt()
  @IsOptional()
  internalExamAverageScore?: number;

  @ApiProperty({
    description: '모의고사 평균 등급',
    required: false,
  })
  @IsInt()
  @IsOptional()
  mockExamAverageScore?: number;
}

export class UpdateUserForInternalRequestType {
  @ApiProperty({
    description: '학생 이름',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: '전화번호',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: '생일',
  })
  @IsOptional()
  birthday?: Date;
}

export class StudentQueryRequestType extends PaginationQuery {
  @ApiProperty({
    description: '학생 이름',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: '학교 이름',
    required: false,
  })
  @IsString()
  @IsOptional()
  schoolName?: string;

  @ApiProperty({
    description: '학생 학년',
    enum: EStudentGrade,
    required: false,
  })
  grade: EStudentGrade;

  @ApiProperty({
    description: '내신 평균 점수',
    required: false,
  })
  @IsInt()
  @IsOptional()
  internalExamAverageScore?: number;

  @ApiProperty({
    description: '모의고사 평균 등급',
    required: false,
  })
  @IsInt()
  @IsOptional()
  mockExamAverageScore?: number;

  @ApiProperty({ description: '생성 일자', required: false })
  @IsDateString()
  @IsOptional()
  readonly createDate?: Date;

  @ApiProperty({ description: '변경 일자', required: false })
  @IsDateString()
  @IsOptional()
  readonly updateDate?: Date;
}
