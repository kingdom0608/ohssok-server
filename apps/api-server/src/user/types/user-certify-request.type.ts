import { ApiProperty } from '@nestjs/swagger';
import { TrimString } from '@app/common';
import { IsNumberString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserCertifyRequestType {
  @ApiProperty({
    description: '전화번호',
    example: '01012345678',
  })
  @MaxLength(11)
  @MinLength(11)
  @TrimString()
  @IsNumberString()
  @Transform(({ value }) => {
    return value.replace(/-/gi, '');
  })
  phoneNumber: string;
}

export class CheckUserCertifyRequestType {
  @ApiProperty({
    description: '코드',
    example: '123456',
  })
  @MaxLength(6)
  @MinLength(6)
  @TrimString()
  @IsNumberString()
  code: string;

  @ApiProperty({
    description: '전화번호',
    example: '01012345678',
  })
  @MaxLength(11)
  @MinLength(11)
  @TrimString()
  @IsNumberString()
  @Transform(({ value }) => {
    return value.replace(/-/gi, '');
  })
  phoneNumber: string;
}
