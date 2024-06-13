import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { EUserAccountProvider, TrimString } from '@app/common';

export class UserResignRequestType {
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
  @MaxLength(10)
  @MinLength(5)
  @TrimString()
  @Matches(/[0-9a-zA-Z.;-]/, {
    message: '영문, 숫자, 특수문자 만 사용할 수 있습니다.',
  })
  password: string;

  @ApiProperty({ description: '제공자', enum: EUserAccountProvider })
  @IsString()
  provider: EUserAccountProvider;
}
