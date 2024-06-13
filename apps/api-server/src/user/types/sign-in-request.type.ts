import { ApiProperty } from '@nestjs/swagger';
import { EUserAccountProvider, TrimString } from '@app/common';
import { IsString } from 'class-validator';

export class SignInRequestType {
  @ApiProperty({
    description: '계정 ID',
  })
  @IsString()
  @TrimString()
  uid: string;

  @ApiProperty({
    description: '패스워드 평문',
  })
  @IsString()
  @TrimString()
  password: string;

  @ApiProperty({ description: '제공자', enum: EUserAccountProvider })
  @IsString()
  provider: EUserAccountProvider;
}

export class ReissueAccessTokenRequestType {
  @ApiProperty({
    description: '계정 ID',
  })
  @IsString()
  @TrimString()
  uid: string;

  @ApiProperty({ description: '제공자', enum: EUserAccountProvider })
  @IsString()
  provider: EUserAccountProvider;

  @ApiProperty({
    description: '레프레시 토큰',
  })
  @IsString()
  refreshToken: string;
}
