import { ApiProperty } from '@nestjs/swagger';
import { ESlotStatus } from '@app/common/enums/banner';
import { PaginationQuery } from '@app/common';
import { IsOptional, IsString } from 'class-validator';

export class SlotQueryRequestType extends PaginationQuery {
  @ApiProperty({ description: '배너 슬롯 제목', required: false })
  @IsString()
  @IsOptional()
  title?: string;
}

export class CreateSlotRequestType {
  @ApiProperty({
    description: '배너 슬롯 제목',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '상태',
    enum: ESlotStatus,
  })
  status: ESlotStatus;
}

export class UpdateSlotRequestType {
  @ApiProperty({
    description: '배너 슬롯 제목',
  })
  @IsString()
  title?: string;

  @ApiProperty({
    description: '상태',
    enum: ESlotStatus,
  })
  status?: ESlotStatus;
}
