import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumberString,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GetVideoResponseType } from '../../content/types';

export class GetLectureContentResponseType {
  @ApiProperty({ description: '강의 아이디' })
  @IsNumberString()
  lectureId: number;

  @ApiProperty({ description: '노출 순서' })
  @IsInt()
  sequence: number;

  @ApiProperty({ description: '영상 아이디' })
  @IsNumberString()
  videoId: number;

  @ApiProperty({ description: '이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '상세 이름' })
  @IsString()
  subName: string;

  @ApiProperty({ description: '내용' })
  @IsString()
  content: string;

  @ApiProperty({ description: '시간' })
  @IsString()
  time: string;

  @ApiProperty({ description: '페이지' })
  @IsString()
  page: string;

  @ApiProperty({ description: '생성 일자' })
  createDate: Date;

  @ApiProperty({ description: '수정 일자' })
  updateDate: Date;

  @ApiProperty({
    description: '영상',
    type: GetVideoResponseType,
    isArray: false,
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => GetVideoResponseType)
  video?: GetVideoResponseType;
}
