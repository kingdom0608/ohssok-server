import { ApiProperty } from '@nestjs/swagger';
import { EUserCertifyStatus } from '@app/common';

export class GetUserCertifyResponseType {
  @ApiProperty({
    description: 'ID',
  })
  readonly id: number;

  @ApiProperty({
    description: '전화번호',
  })
  readonly phoneNumber: string;

  @ApiProperty({
    description: '상태',
    enum: EUserCertifyStatus,
  })
  readonly status: EUserCertifyStatus;

  @ApiProperty({ description: '생성 일자' })
  readonly createDate: Date;

  @ApiProperty({ description: '수정 일자' })
  readonly updateDate: Date;
}

export class CheckUserCertifyResponseType {
  @ApiProperty({
    description: '코드 일치 여부',
  })
  readonly isEqualCode: boolean;
}
