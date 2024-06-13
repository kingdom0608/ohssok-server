import { ApiProperty } from '@nestjs/swagger';
import { ECategoryStatus } from '@app/common/enums/lecture/category.enum';
import { GetCategoryResponseType } from './category-response.type';

export class GetUpperCategoryResponseType {
  @ApiProperty({ description: 'ID' })
  readonly id: number;

  @ApiProperty({
    description: '이름',
  })
  name: string;

  @ApiProperty({
    description: '상태',
    enum: ECategoryStatus,
  })
  status: ECategoryStatus;

  @ApiProperty({ description: '생성 일자' })
  readonly createDate: Date;

  @ApiProperty({ description: '변경 일자' })
  readonly updateDate: Date;

  @ApiProperty({ description: '하위 카테고리' })
  categories: GetCategoryResponseType[];
}
