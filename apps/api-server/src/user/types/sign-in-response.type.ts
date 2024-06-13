import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { GetUserResponseType } from './user-response.type';

export class SignInResponseType extends GetUserResponseType {
  @ApiProperty({
    description: '엑세스 토큰',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: '리프레시 토큰',
  })
  @IsString()
  refreshToken: string;
}
