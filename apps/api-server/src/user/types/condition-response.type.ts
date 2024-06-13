import { ApiProperty } from '@nestjs/swagger';
import { EConditionStatus, EConditionType } from '@app/common';

export class GetConditionResponseType {
  @ApiProperty({
    description: 'ID',
  })
  readonly id: number;

  @ApiProperty({ description: '타입', enum: EConditionType })
  type: EConditionType;

  @ApiProperty({ description: '상태', enum: EConditionStatus })
  status: EConditionStatus;

  @ApiProperty({ description: '내용' })
  content: string;

  @ApiProperty({ description: '공고 일자' })
  readonly publicDate: Date;

  @ApiProperty({ description: '시행 일자' })
  readonly effectiveDate: Date;
}
