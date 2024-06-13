import { ENoticeCategory, ENoticeStatus } from '@app/common/enums/notice';
import { ApiProperty } from '@nestjs/swagger';

export class GetNoticeResponseType {
  @ApiProperty({ description: 'ID' })
  readonly id: number;

  @ApiProperty({ description: '공지사항 제목' })
  title: string;

  @ApiProperty({ description: '공지사항 내용' })
  contents: string;

  @ApiProperty({ description: '카테고리', enum: ENoticeCategory })
  category: ENoticeCategory;

  @ApiProperty({ description: '상태', enum: ENoticeCategory })
  status: ENoticeStatus;

  @ApiProperty({ description: '생성 일자' })
  readonly createDate: Date;

  @ApiProperty({ description: '수정 일자' })
  readonly updateDate: Date;
}
