import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateLectureTagRequestType {
  @ApiProperty({ description: '이름' })
  @IsString()
  name: string;
}
