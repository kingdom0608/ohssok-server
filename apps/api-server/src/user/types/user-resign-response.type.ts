import { ApiProperty } from '@nestjs/swagger';

export class UserResignResponseType {
  @ApiProperty({
    description: 'ID',
  })
  readonly id: number;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '노출 이름' })
  displayName: string;

  @ApiProperty({ description: '전화번호' })
  phoneNumber: string;

  @ApiProperty({ description: '생성 일자' })
  readonly createDate: Date;

  @ApiProperty({ description: '변경 일자' })
  readonly updateDate: Date;
}
