import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateLectureThumbnailRequestType {
  @ApiProperty({ description: '이미지 ID' })
  @IsInt()
  imageId: number;

  @ApiProperty({ description: '표시 순서, 0 이상' })
  @IsInt()
  sequence: number;

  @ApiProperty({ description: '이미지 url' })
  @IsString()
  imageUrl: string;
}

export class UpdateLectureThumbnailRequestType {
  @ApiProperty({ description: '강의 섬네일 ID', required: false })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ description: '이미지 ID' })
  @IsInt()
  imageId: number;

  @ApiProperty({ description: '표시 순서, 0 이상' })
  @IsInt()
  sequence: number;

  @ApiProperty({ description: '이미지 url' })
  @IsString()
  imageUrl: string;
}
