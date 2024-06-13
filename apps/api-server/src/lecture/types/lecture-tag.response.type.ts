import { ApiProperty } from '@nestjs/swagger';

export class GetLectureTagResponseType {
  @ApiProperty({ description: 'ID' })
  id: number;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '생성 일자' })
  createDate: Date;

  @ApiProperty({ description: '수정 일자' })
  updateDate: Date;
}
