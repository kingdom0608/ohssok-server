import { ApiProperty } from '@nestjs/swagger';
import {
  EStudentManagementCardDetailStatus,
  EStudentManagementCardDetailTestPassStatus,
} from '@app/common/enums/student/student-management-card-detail.enum';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GetStudentManagementCardDetailHomeworkResponseType } from './student-management-card-detail-homework-response.type';

export class GetStudentManagementCardDetailResponseType {
  @ApiProperty({ description: 'ID' })
  readonly id: number;

  @ApiProperty({
    description: '상태',
    enum: EStudentManagementCardDetailStatus,
  })
  status: EStudentManagementCardDetailStatus;

  @ApiProperty({
    description: '주차',
  })
  week: string;

  @ApiProperty({
    description: '어휘 테스트 통과 여부',
    nullable: true,
    enum: EStudentManagementCardDetailTestPassStatus,
  })
  vocabularyTestPassStatus?: EStudentManagementCardDetailTestPassStatus;

  @ApiProperty({
    description: '어휘 테스트 점수',
  })
  vocabularyTestScore?: string;

  @ApiProperty({
    description: '백지 테스트 통과 여부',
    nullable: true,
    enum: EStudentManagementCardDetailTestPassStatus,
  })
  blankTestPass?: EStudentManagementCardDetailTestPassStatus;

  @ApiProperty({
    description: '백지 테스트 점수',
  })
  blankTestScore?: string;

  @ApiProperty({
    description: '비고',
  })
  note?: string;

  @ApiProperty({
    description: '피드백',
  })
  feedback?: string;

  @ApiProperty({
    description: '숙제',
    type: GetStudentManagementCardDetailHomeworkResponseType,
    isArray: true,
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => GetStudentManagementCardDetailHomeworkResponseType)
  homeworks?: GetStudentManagementCardDetailHomeworkResponseType[];

  @ApiProperty({ description: '생성 일자' })
  readonly createDate: Date;

  @ApiProperty({ description: '변경 일자' })
  readonly updateDate: Date;
}
