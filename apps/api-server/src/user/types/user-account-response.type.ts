import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { EUserAccountProvider, EUserStatus } from '@app/common';

export class GetUserAccountResponseType {
  @ApiProperty({ description: 'ID' })
  @IsInt()
  id: number;

  @ApiProperty({ description: '유저 ID' })
  @IsInt()
  userId: number;

  @ApiProperty({ description: '계정 ID' })
  @IsString()
  uid: string;

  @ApiProperty({ description: '상태', enum: EUserStatus })
  @IsString()
  status: EUserStatus;

  @ApiProperty({ description: '제공자', enum: EUserAccountProvider })
  @IsString()
  provider: EUserAccountProvider;

  @ApiProperty({ description: '생성 일자' })
  readonly createDate: Date;

  @ApiProperty({ description: '변경 일자' })
  readonly updateDate: Date;
}

export class CheckUserAccountByUid {
  @ApiProperty({
    description: '계정 ID 존재 여부',
  })
  readonly isExistUid: boolean;
}
