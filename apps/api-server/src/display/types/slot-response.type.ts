import { ApiProperty } from '@nestjs/swagger';
import { ESlotStatus } from '@app/common/enums/banner';
import { GetBannerResponseType } from './banner-response.type';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class GetSlotResponseType {
  @ApiProperty({ description: 'ID' })
  readonly id: number;

  @ApiProperty({
    description: '배너 슬롯 제목',
  })
  title: string;

  @ApiProperty({
    description: '상태',
    enum: ESlotStatus,
  })
  status: ESlotStatus;

  @ApiProperty({ description: '작성자 User ID' })
  writerUserId: number;

  @ApiProperty({ description: '생성 일자' })
  readonly createDate: Date;

  @ApiProperty({ description: '수정 일자' })
  readonly updateDate: Date;

  @ApiProperty({
    description: '배너 목록',
    type: GetBannerResponseType,
    isArray: true,
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GetBannerResponseType)
  readonly banners: GetBannerResponseType[];
}
