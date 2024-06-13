import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthenticationResponseType {
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
