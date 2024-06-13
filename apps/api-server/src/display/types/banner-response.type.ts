import { ApiProperty } from '@nestjs/swagger';
import { EBannerPlatform, EBannerStatus } from '@app/common/enums/banner';

export class GetBannerResponseType {
  @ApiProperty({ description: 'ID' })
  readonly id: number;

  @ApiProperty({ description: '노출 순서' })
  sequence: number;

  @ApiProperty({ description: '연결된 링크 Url', required: false })
  url?: string;

  @ApiProperty({ description: '배너 제목' })
  title: string;

  @ApiProperty({ description: '배너 상세 설명', required: false })
  description?: string;

  @ApiProperty({ description: '표시 플랫폼', enum: EBannerPlatform })
  platform: EBannerPlatform;

  @ApiProperty({ description: '이미지 Url' })
  imageUrl: string;

  @ApiProperty({ description: '상태', enum: EBannerStatus })
  status: EBannerStatus;

  @ApiProperty({ description: '작성자 User ID' })
  writerUserId: number;

  @ApiProperty({ description: '생성 일자' })
  readonly createDate: Date;

  @ApiProperty({ description: '수정 일자' })
  readonly updateDate: Date;
}
