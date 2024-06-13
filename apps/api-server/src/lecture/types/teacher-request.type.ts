import { ApiProperty } from '@nestjs/swagger';
import { ETeacherStatus, PaginationQuery } from '@app/common';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class TeacherQueryRequestType extends PaginationQuery {
  @ApiProperty({ description: '이름', required: false })
  @IsString()
  @IsOptional()
  name?: string;
}

export class CreateTeacherRequestType {
  @ApiProperty({ description: '이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '설명' })
  @IsString()
  description: string;

  @ApiProperty({
    description: '프로필 이미지 Url',
    type: 'text',
    required: false,
  })
  @IsOptional()
  @IsString()
  profileImageUrl?: string;
}

export class UpdateTeacherRequestType {
  @ApiProperty({ description: '이름', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: '상태',
    enum: ETeacherStatus,
  })
  @IsString()
  @IsOptional()
  status?: ETeacherStatus;

  @ApiProperty({ description: '설명', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '프로필 이미지 Url',
    type: 'text',
    required: false,
  })
  @IsOptional()
  @IsString()
  profileImageUrl?: string;
}

export class UploadTeacherProfileImageResponseType {
  @ApiProperty({ description: '버킷' })
  bucket: string;

  @ApiProperty({ description: '파일 키' })
  key: string;

  @ApiProperty({ description: '파일 이름' })
  fileName: string;

  @ApiProperty({ description: '파일 경로' })
  filePath: string;

  @ApiProperty({ description: '파일 액세스 url' })
  url: string;
}

export class UploadTeacherImageRequestType {
  @ApiProperty({ description: '강사 id' })
  @IsNumberString()
  teacherId: number;

  @ApiProperty({
    description: '강사 프로필 이미지 파일 목록(png, jpg, jpeg)',
    format: 'binary',
  })
  readonly files: Express.Multer.File[];
}
