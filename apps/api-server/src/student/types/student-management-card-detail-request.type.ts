import { ApiProperty } from '@nestjs/swagger';
import { EStudentManagementCardDetailTestPassStatus } from '@app/common/enums/student/student-management-card-detail.enum';
import { IsPositiveInteger } from '@app/common/decorators/validation/integer.decorator';
import {
  EStudentManagementCardDetailStatus,
  IsEnumString,
  PaginationQuery,
} from '@app/common';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  CreateStudentManagementCardDetailHomeworkRequestType,
  UpsertStudentManagementCardDetailHomeworkRequestType,
} from './student-management-card-detail-homework-request.type';

export class StudentManagementCardDetailQueryRequestType extends PaginationQuery {
  @ApiProperty({ description: '학생 관리 카드 ID', required: true })
  @IsPositiveInteger()
  studentManagementCardId: number;

  @ApiProperty({
    description: '상태',
    required: false,
    enum: [
      EStudentManagementCardDetailStatus.ACTIVE,
      EStudentManagementCardDetailStatus.INACTIVE,
    ],
  })
  @IsEnum([
    EStudentManagementCardDetailStatus.ACTIVE,
    EStudentManagementCardDetailStatus.INACTIVE,
  ])
  @IsString()
  @IsOptional()
  status?: EStudentManagementCardDetailStatus;

  @ApiProperty({ description: '주차', required: false })
  @IsString()
  @IsOptional()
  week?: string;
}

export class CreateStudentManagementCardDetailRequestType {
  @ApiProperty({
    description: '학생 관리 카드 Id',
  })
  @IsInt()
  studentManagementCardId: number;

  @ApiProperty({
    description: '주차',
  })
  @IsString()
  week: string;

  @ApiProperty({
    description: '어휘 테스트 통과 상태 : PASS, FAILED, NONE - 미지정시 NONE',
    required: false,
  })
  @IsEnumString(EStudentManagementCardDetailTestPassStatus, '테스트 통과 상태')
  @IsString()
  @IsOptional()
  vocabularyTestPassStatus?: EStudentManagementCardDetailTestPassStatus;

  @ApiProperty({
    description: '어휘 테스트 점수',
    required: false,
  })
  @IsString()
  @IsOptional()
  vocabularyTestScore?: string;

  @ApiProperty({
    description: '백지 테스트 통과 상태 : PASS, FAILED, NONE - 미지정시 NONE',
    required: false,
  })
  @IsEnumString(EStudentManagementCardDetailTestPassStatus, '테스트 통과 상태')
  @IsString()
  @IsOptional()
  blankTestPassStatus?: EStudentManagementCardDetailTestPassStatus;

  @ApiProperty({
    description: '백지 테스트 점수',
    required: false,
  })
  @IsString()
  @IsOptional()
  blankTestScore?: string;

  @ApiProperty({
    description: '비고',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({
    description: '피드백',
    required: false,
  })
  @IsString()
  @IsOptional()
  feedback?: string;

  @ApiProperty({
    description: '피드백',
    type: CreateStudentManagementCardDetailHomeworkRequestType,
    isArray: true,
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateStudentManagementCardDetailHomeworkRequestType)
  homeworks?: CreateStudentManagementCardDetailHomeworkRequestType[];
}

export class UpdateStudentManagementCardDetailRequestType {
  @ApiProperty({
    description: '상태',
    required: false,
    enum: [
      EStudentManagementCardDetailStatus.ACTIVE,
      EStudentManagementCardDetailStatus.INACTIVE,
    ],
  })
  @IsEnum([
    EStudentManagementCardDetailStatus.ACTIVE,
    EStudentManagementCardDetailStatus.INACTIVE,
  ])
  @IsString()
  @IsOptional()
  status?: EStudentManagementCardDetailStatus;

  @ApiProperty({
    description: '주차',
    required: false,
  })
  @IsString()
  @IsOptional()
  week?: string;

  @ApiProperty({
    description: '어휘 테스트 통과 상태 : PASS, FAILED, NONE - 미지정시 NONE',
    required: false,
  })
  @IsEnumString(EStudentManagementCardDetailTestPassStatus, '테스트 통과 상태')
  @IsString()
  @IsOptional()
  vocabularyTestPassStatus?: EStudentManagementCardDetailTestPassStatus;

  @ApiProperty({
    description: '어휘 테스트 점수',
    required: false,
  })
  @IsString()
  @IsOptional()
  vocabularyTestScore?: string;

  @ApiProperty({
    description: '백지 테스트 통과 상태 : PASS, FAILED, NONE - 미지정시 NONE',
    required: false,
  })
  @IsEnumString(EStudentManagementCardDetailTestPassStatus, '테스트 통과 상태')
  @IsString()
  @IsOptional()
  blankTestPassStatus?: EStudentManagementCardDetailTestPassStatus;

  @ApiProperty({
    description: '백지 테스트 점수',
    required: false,
  })
  @IsString()
  @IsOptional()
  blankTestScore?: string;

  @ApiProperty({
    description: '비고',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({
    description: '피드백',
    required: false,
  })
  @IsString()
  @IsOptional()
  feedback?: string;

  @ApiProperty({
    description: '피드백',
    type: UpsertStudentManagementCardDetailHomeworkRequestType,
    isArray: true,
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => UpsertStudentManagementCardDetailHomeworkRequestType)
  homeworks?: UpsertStudentManagementCardDetailHomeworkRequestType[];
}

export class SendStudentManagementCardDetailRequestType {
  @ApiProperty({
    description: '학생 관리 카드 상세 ID',
    required: true,
  })
  @IsPositiveInteger()
  id: number;
}
