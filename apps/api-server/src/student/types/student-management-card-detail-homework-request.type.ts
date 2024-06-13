import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import {
  EStudentManagementCardDetailHomeworkCheck,
  IsEnumString,
} from '@app/common';

export class CreateStudentManagementCardDetailHomeworkRequestType {
  @ApiProperty({
    description: '숙제 아이디',
    required: false,
  })
  @IsInt()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: '어휘 테스트 통과 여부',
    required: false,
  })
  @IsEnumString(EStudentManagementCardDetailHomeworkCheck, '숙제 검사')
  @IsString()
  @IsOptional()
  homeworkCheck?: EStudentManagementCardDetailHomeworkCheck;

  @ApiProperty({
    description: '숙제 이름',
    required: false,
  })
  @IsString()
  @IsOptional()
  homeworkName: string;
}

export class UpsertStudentManagementCardDetailHomeworkRequestType {
  @ApiProperty({
    description: '숙제 아이디',
    required: false,
  })
  @IsInt()
  @IsOptional()
  id?: number;

  @ApiProperty({
    description: '어휘 테스트 통과 여부',
    required: false,
  })
  @IsEnumString(EStudentManagementCardDetailHomeworkCheck, '숙제 검사')
  @IsString()
  @IsOptional()
  homeworkCheck?: EStudentManagementCardDetailHomeworkCheck;

  @ApiProperty({
    description: '숙제 이름',
    required: false,
  })
  @IsString()
  @IsOptional()
  homeworkName: string;
}
