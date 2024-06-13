import { ApiProperty } from '@nestjs/swagger';
import { ETextbookStatus } from '@app/common';

export class GetTextbookResponseType {
  @ApiProperty({ description: 'ID' })
  id: number;

  @ApiProperty({ description: '이미지 ID' })
  imageId: number;

  @ApiProperty({ description: '이미지 URL' })
  imageUrl: string;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '상태', enum: ETextbookStatus })
  statis: ETextbookStatus;

  @ApiProperty({ description: '저자' })
  author: string;

  @ApiProperty({ description: '페이지' })
  page: string;

  @ApiProperty({ description: '페이지' })
  size: string;

  @ApiProperty({ description: '설명' })
  description: string;

  @ApiProperty({ description: '출간 일자' })
  publishDate: Date;

  @ApiProperty({ description: '생성 일자' })
  createDate: Date;

  @ApiProperty({ description: '수정 일자' })
  updateDate: Date;
}
