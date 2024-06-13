import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { GetUserAccountResponseType } from './user-account-response.type';

export class GetUserResponseType {
  @ApiProperty({
    description: 'ID',
  })
  readonly id: number;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '노출 이름' })
  displayName: string;

  @ApiProperty({ description: '전화번호' })
  phoneNumber: string;

  @ApiProperty({ description: '생년월일' })
  birthday: Date;

  @ApiProperty({ description: '주소' })
  address: string;

  @ApiProperty({ description: '우편번호' })
  @IsString()
  zipCode: string;

  @ApiProperty({ description: '상세 주소' })
  @IsString()
  @IsOptional()
  detailAddress?: string;

  @ApiProperty({ description: '생성 일자' })
  readonly createDate: Date;

  @ApiProperty({ description: '변경 일자' })
  readonly updateDate: Date;

  @ApiModelProperty({
    description: '계정',
    type: GetUserAccountResponseType,
    isArray: true,
  })
  @Type(() => GetUserAccountResponseType)
  @ValidateNested()
  readonly accounts?: GetUserAccountResponseType[];
}

export class UploadUserProfileImageResponseType {
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
