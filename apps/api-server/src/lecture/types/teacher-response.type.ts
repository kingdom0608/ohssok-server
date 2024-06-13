import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';
import { ETeacherStatus, PageListResponseType } from '@app/common';
import { GetLectureResponseType } from './lecture-response.type';
import { Type } from 'class-transformer';

export class GetTeacherResponseType {
  @ApiProperty({ description: 'ID' })
  @IsInt()
  id: number;

  @ApiProperty({ description: '이름' })
  @IsString()
  name: string;

  @ApiProperty({
    description: '상태',
    enum: ETeacherStatus,
  })
  @IsString()
  status?: ETeacherStatus;

  @ApiProperty({ description: '설명' })
  @IsString()
  description: string;

  @ApiProperty({
    description: '프로필 이미지 Url',
    type: 'text',
    nullable: true,
  })
  profileImageUrl?: string;

  @ApiProperty({ description: '강의 목록' })
  @IsArray()
  lectures: GetLectureResponseType[];
}

export class GetTeacherPageListResponseType extends PageListResponseType {
  @ApiProperty({
    description: '강사 목록',
    type: GetTeacherResponseType,
    isArray: true,
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GetTeacherResponseType)
  list: GetTeacherResponseType[];
}
