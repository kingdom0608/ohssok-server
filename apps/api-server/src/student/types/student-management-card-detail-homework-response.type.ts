import { ApiProperty } from '@nestjs/swagger';
import { EStudentManagementCardDetailHomeworkCheck } from '@app/common/enums/student/student-management-card-detail-homework.enum';

export class GetStudentManagementCardDetailHomeworkResponseType {
  @ApiProperty({ description: 'ID' })
  readonly id: number;

  @ApiProperty({
    description: '숙제 이름',
  })
  homeworkName: string;

  @ApiProperty({
    description: '숙제 검사',
    enum: EStudentManagementCardDetailHomeworkCheck,
  })
  homeworkCheck?: EStudentManagementCardDetailHomeworkCheck;

  @ApiProperty({ description: '생성 일자' })
  readonly createDate: Date;

  @ApiProperty({ description: '변경 일자' })
  readonly updateDate: Date;
}
