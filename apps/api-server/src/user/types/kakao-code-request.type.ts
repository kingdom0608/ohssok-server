import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class KakaoCodeRequestType {
  @ApiProperty({
    description: '인가코드',
  })
  @IsString()
  code: string;
}
