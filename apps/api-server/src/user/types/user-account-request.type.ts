import { ApiProperty } from '@nestjs/swagger';
import {
  EUserAccountProvider,
  EUserAccountStatus,
  TrimString,
} from '@app/common';
import {
  IsNumberString,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserAccountRequestType {
  userId: number;
  status: EUserAccountStatus;

  @ApiProperty({ description: '계정 ID' })
  @IsString()
  @MinLength(6, { message: '아이디는 6글자 이상이어야 합니다.' })
  @MaxLength(12)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/, {
    message: '아이디는 영문+숫자 조합으로 이루어져야 합니다',
  })
  @TrimString()
  uid: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString()
  @MinLength(8, { message: '비밀번호는 8자 이상이어야 합니다' })
  @MaxLength(15)
  @Matches(/^(?!.*(.)\1{3}).*$/, {
    message: '비밀번호는 동일한 문자가 4자 이상 반복되게 설정이 불가합니다',
  })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, {
    message: '비밀번호는 영문+숫자 조합으로 이루어져야 합니다.',
  })
  password: string;

  @ApiProperty({ description: '제공자', enum: EUserAccountProvider })
  @IsString()
  provider: EUserAccountProvider;
}

export class ResetUserAccountPasswordRequestType {
  @ApiProperty({ description: '이름', required: false })
  @IsString()
  name: string;

  @ApiProperty({ description: '계정 ID', required: false })
  @IsString()
  uid: string;

  @ApiProperty({ description: '전화번호', required: false })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: '신규 비밀번호' })
  @IsString()
  @MinLength(8, { message: '비밀번호는 8자 이상 입니다.' })
  @MaxLength(15)
  @Matches(/^(?!.*(.)\1{3}).*$/, {
    message: '비밀번호는 동일한 문자가 4자 이상 반복 되게 설정이 불가 합니다.',
  })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, {
    message: '비밀번호는 영문 + 숫자 조합으로 이루어져야 합니다.',
  })
  newPassword: string;
}

export class ResetUserAccountPasswordForSignInRequestType {
  @ApiProperty({ description: '기존 비밀번호' })
  @IsString()
  @MinLength(8, { message: '비밀번호는 8자 이상 입니다.' })
  @MaxLength(15)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, {
    message: '비밀번호는 영문 + 숫자 조합으로 이루어져야 합니다.',
  })
  nowPassword: string;

  @ApiProperty({ description: '신규 비밀번호' })
  @IsString()
  @MinLength(8, { message: '비밀번호는 8자 이상 입니다.' })
  @MaxLength(15)
  @Matches(/^(?!.*(.)\1{3}).*$/, {
    message: '비밀번호는 동일한 문자가 4자 이상 반복 되게 설정이 불가 합니다.',
  })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, {
    message: '비밀번호는 영문 + 숫자 조합으로 이루어져야 합니다.',
  })
  newPassword: string;
}

export class GetUserAccountUidRequestType {
  @ApiProperty({ description: '이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '전화번호' })
  @MaxLength(11)
  @MinLength(11)
  @TrimString()
  @IsNumberString()
  @Transform(({ value }) => {
    return value.replace(/-/gi, '');
  })
  phoneNumber: string;
}

export class CheckUserAccountRequestType {
  @ApiProperty({ description: '이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '계정 ID' })
  @IsString()
  uid: string;

  @ApiProperty({ description: '전화번호' })
  @MaxLength(11)
  @MinLength(11)
  @TrimString()
  @IsNumberString()
  @Transform(({ value }) => {
    return value.replace(/-/gi, '');
  })
  phoneNumber: string;
}

export class CheckUserAccountUidRequestType {
  @ApiProperty({ description: '계정 ID' })
  @IsString()
  uid: string;
}
