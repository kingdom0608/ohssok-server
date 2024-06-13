import {
  EConditionStatus,
  EConditionType,
  PaginationQuery,
  TrimString,
} from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class CreateConditionRequestType {
  @ApiProperty({ description: '타입', enum: EConditionType })
  @IsEnum(EConditionType)
  type: EConditionType;

  @ApiProperty({ description: '상태', enum: EConditionStatus })
  @IsEnum(EConditionStatus)
  status: EConditionStatus;

  @ApiProperty({ description: '내용' })
  @TrimString()
  content: string;

  @ApiProperty({ description: '공고 일자' })
  readonly publicDate: Date;

  @ApiProperty({ description: '시행 일자' })
  readonly effectiveDate: Date;
}

export class ListConditionQueryRequestType extends PaginationQuery {
  status: EConditionStatus;
}

export class UpdateConditionRequestType {
  @ApiProperty({ description: '타입', enum: EConditionType, required: false })
  @IsEnum(EConditionType)
  @IsOptional()
  type?: EConditionType;

  @ApiProperty({ description: '상태', enum: EConditionStatus, required: false })
  @IsEnum(EConditionStatus)
  @IsOptional()
  status?: EConditionStatus;

  @ApiProperty({ description: '내용', required: false })
  @TrimString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: '공고 일자', required: false })
  @IsOptional()
  readonly publicDate: Date;

  @ApiProperty({ description: '시행 일자', required: false })
  @IsOptional()
  readonly effectiveDate?: Date;
}
