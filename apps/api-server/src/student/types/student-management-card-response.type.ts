import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GetStudentResponseType } from './student-response.type';
import { GetStudentManagementCardDetailHomeworkResponseType } from './student-management-card-detail-homework-response.type';
import { GetStudentManagementCardDetailResponseType } from './student-management-card-detail-response.type';
import { EStudentManagementCardStatus } from '@app/common';

export class GetStudentManagementCardResponseType {
  @ApiProperty({ description: 'ID' })
  readonly id: number;

  @ApiProperty({
    description: '강의 아이디',
  })
  lectureId: string;

  @ApiProperty({
    description: '강의명',
  })
  lectureTitle: string;

  @ApiProperty({
    description: '학생 ID',
  })
  studentId: number;

  @ApiProperty({
    description: '학생 관리 카드 코드',
  })
  code: string;

  @ApiProperty({
    description: '상태',
    enum: EStudentManagementCardStatus,
  })
  status: EStudentManagementCardStatus;

  @ApiProperty({
    description: '학생',
    type: GetStudentResponseType,
    required: true,
  })
  @ValidateNested({ each: true })
  @Type(() => GetStudentResponseType)
  student: GetStudentResponseType;

  @ApiProperty({
    description: '숙제',
    type: GetStudentManagementCardDetailHomeworkResponseType,
    isArray: true,
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => GetStudentManagementCardDetailResponseType)
  details?: GetStudentManagementCardDetailResponseType[];

  @ApiProperty({ description: '생성 일자' })
  readonly createDate: Date;

  @ApiProperty({ description: '변경 일자' })
  readonly updateDate: Date;
}
