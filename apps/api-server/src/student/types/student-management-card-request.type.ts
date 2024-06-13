import { ApiProperty } from '@nestjs/swagger';
import { IsPositiveInteger } from '@app/common/decorators/validation/integer.decorator';
import {
  EStudentGrade,
  EStudentManagementCardStatus,
  IsEnumArrayString,
  PaginationQuery,
} from '@app/common';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class StudentManagementCardQueryRequestType extends PaginationQuery {
  userId: number;

  @ApiProperty({
    description: '상태',
    required: false,
    enum: [
      EStudentManagementCardStatus.ACTIVE,
      EStudentManagementCardStatus.INACTIVE,
    ],
  })
  @IsEnum([
    EStudentManagementCardStatus.ACTIVE,
    EStudentManagementCardStatus.INACTIVE,
  ])
  @IsString()
  @IsOptional()
  status?: EStudentManagementCardStatus;

  @ApiProperty({ description: '학생 이름', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '전화 번호', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: number;

  @ApiProperty({ description: '생년월일', required: false })
  @IsDateString()
  @IsOptional()
  birth?: Date;

  @ApiProperty({
    description:
      "학생 학년 - ELEMENTARY, MIDDLE_1, MIDDLE_2, MIDDLE_3, HIGH_1, HIGH_2, HIGH_3, ETC: 복수 시, 공백 없이 구분자 ','를 사용하여 표현 ",
    required: false,
  })
  @IsEnumArrayString(EStudentGrade, '학년')
  @IsString()
  @IsOptional()
  grades?: string;

  @ApiProperty({ description: '학생 관리 카드 제목', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: '학생 관리 카드 생성일 시작', required: false })
  @IsDateString()
  @IsOptional()
  createDateFrom?: Date;

  @ApiProperty({ description: '학생 관리 카드 생성일 끝', required: false })
  @IsDateString()
  @IsOptional()
  createDateTo?: Date;
}

export class CreateStudentManagementCardRequestType {
  @ApiProperty({ description: '강의 Id', required: false })
  @IsInt()
  lectureId: number;

  @ApiProperty({ description: '강의 제목' })
  @IsString()
  lectureName: string;

  @ApiProperty({ description: '학생 Id', required: false })
  @IsInt()
  studentId: number;
}

export class UpdateStudentManagementCardRequestType {
  @ApiProperty({ description: '강의 Id', required: false })
  @IsInt()
  @IsOptional()
  lectureId?: number;

  @ApiProperty({ description: '강의 제목', required: false })
  @IsString()
  @IsOptional()
  lectureName?: string;

  @ApiProperty({
    description: '상태',
    required: false,
    enum: [
      EStudentManagementCardStatus.ACTIVE,
      EStudentManagementCardStatus.INACTIVE,
    ],
  })
  @IsEnum([
    EStudentManagementCardStatus.ACTIVE,
    EStudentManagementCardStatus.INACTIVE,
  ])
  @IsString()
  @IsOptional()
  status?: EStudentManagementCardStatus;
}

export class SendStudentManagementCardRequestType {
  @ApiProperty({ description: '학생 관리 카드 ID', required: true })
  @IsPositiveInteger()
  id: number;
}
