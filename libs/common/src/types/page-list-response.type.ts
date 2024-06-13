import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class PageListResponseType {
  @ApiProperty({
    description: 'totalRow',
  })
  @IsInt()
  totalRow: number;

  @ApiProperty({
    description: 'pageRow',
  })
  @IsInt()
  pageRow: number;

  @ApiProperty({
    description: 'hasNext',
  })
  @IsInt()
  hasNext: number;

  @ApiProperty({
    description: 'totalPage',
  })
  @IsInt()
  totalPage: number;

  @ApiProperty({
    description: 'page',
  })
  @IsInt()
  page: number;

  @ApiProperty({
    description: 'size',
  })
  @IsInt()
  size: number;
}
