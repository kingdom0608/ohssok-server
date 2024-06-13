import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationQuery {
  @ApiProperty({
    description: '해당 페이지에서 시작하는 데이터 row 번호',
    required: false,
    default: 0,
  })
  @IsOptional()
  readonly offset?: number = 0;

  @ApiProperty({
    description: '한 페이지에서 보여 주려고 하는 row 개수',
    required: false,
    default: 10,
  })
  @IsOptional()
  readonly size?: number;

  @ApiProperty({
    description: '어드민 페이지에서 사용하는 페이지 단위 (1page=500row)',
    required: false,
    nullable: true,
  })
  @IsOptional()
  readonly page?: number;

  @ApiProperty({
    description:
      '"컬럼명-ASC || DESC" 형태로 복수 시, 구분자 \',\'를 사용하여 표현',
    required: false,
  })
  @IsOptional()
  readonly sortBy?: string;
}
