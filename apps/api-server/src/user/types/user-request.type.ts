import { ApiProperty } from '@nestjs/swagger';
import {
  EStudentGrade,
  EUserRole,
  EUserStatus,
  IsEnumArrayString,
  PaginationQuery,
} from '@app/common';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateUserAccountRequestType } from './user-account-request.type';
import { CreateUserConditionRelationRequestType } from './user-condition-relation-request.type';

export class UserQueryRequestType extends PaginationQuery {
  @ApiProperty({ description: '전화번호', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    return value.replace(/-/gi, '');
  })
  phoneNumber?: string;

  @ApiProperty({ description: '이름', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '닉네임', required: false })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty({
    description:
      "역할 - PARENT, STUDENT, ADMIN, OWNER, TEACHER : 복수 시, 구분자 ','를 사용하여 표현",
    required: false,
  })
  @IsEnumArrayString(EUserRole, '역할')
  @IsString()
  @IsOptional()
  roles?: string;

  @ApiProperty({
    description: "상태 - ACTIVE, INACTIVE, 복수 시, 구분자 ','를 사용하여 표현",
    required: false,
  })
  @IsEnumArrayString(EUserStatus, '상태')
  @IsString()
  @IsOptional()
  statuses?: string;

  @ApiProperty({ description: '아이디', required: false })
  @IsString()
  @IsOptional()
  uid?: string;
}

export class CreateUserRequestType {
  status: EUserStatus;

  @ApiProperty({
    description: '카카오톡 코드',
    required: false,
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ description: '이름' })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  name: string;

  @ApiProperty({ description: '노출 이름' })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  displayName: string;

  @ApiProperty({ description: '전화번호' })
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Transform(({ value }) => {
    return value.replace(/-/gi, '');
  })
  phoneNumber: string;

  @ApiProperty({ description: '학부모 전화번호' })
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Transform(({ value }) => {
    return value.replace(/-/gi, '');
  })
  parentPhoneNumber: string;

  @ApiProperty({ description: '생년월일' })
  birthday: Date;

  @ApiProperty({ description: '학교 이름', nullable: true })
  @IsString()
  @IsOptional()
  schoolName?: string;

  @ApiProperty({ description: '주소', nullable: true })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: '우편번호', nullable: true })
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiProperty({ description: '상세 주소', nullable: true })
  @IsString()
  @IsOptional()
  detailAddress?: string;

  @ApiProperty({
    description: '역할',
    enum: [EUserRole.STUDENT, EUserRole.PARENT],
  })
  @IsEnum([EUserRole.STUDENT, EUserRole.PARENT])
  @IsString()
  role: EUserRole;

  @ApiProperty({
    description: '학년',
    enum: EStudentGrade,
    required: false,
  })
  @IsOptional()
  grade?: EStudentGrade;

  @ApiProperty({
    description: '내신 평균 점수',
    required: false,
  })
  @IsInt()
  @IsOptional()
  internalExamAverageScore?: number;

  @ApiProperty({
    description: '모의고사 평균 등급',
    required: false,
  })
  @IsInt()
  @IsOptional()
  mockExamAverageScore?: number;

  @ApiProperty({
    description: '유저 계정',
    type: CreateUserAccountRequestType,
    isArray: true,
    required: true,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateUserAccountRequestType)
  accounts: CreateUserAccountRequestType[];

  @ApiProperty({
    description: '유저 약관',
    type: CreateUserConditionRelationRequestType,
    isArray: true,
    required: true,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateUserConditionRelationRequestType)
  conditionRelations: CreateUserConditionRelationRequestType[];
}

export class CreateAdminUserForAdminRequestType {
  status: EUserStatus;

  @ApiProperty({ description: '이름' })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  name: string;

  @ApiProperty({ description: '노출 이름' })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  displayName: string;

  @ApiProperty({ description: '전화번호' })
  @IsString()
  @MinLength(11)
  @MaxLength(12)
  @Transform(({ value }) => {
    return value.replace(/-/gi, '');
  })
  phoneNumber: string;

  @ApiProperty({ description: '생년월일' })
  @IsDateString()
  birthday: Date;

  @ApiProperty({ description: '주소' })
  @IsString()
  address: string;

  @ApiProperty({ description: '우편번호' })
  @IsString()
  zipCode: string;

  @ApiProperty({ description: '상세 주소', nullable: true })
  @IsString()
  @IsOptional()
  detailAddress?: string;

  @ApiProperty({
    description: '역할',
    enum: [EUserRole.ADMIN, EUserRole.TEACHER],
  })
  @IsEnum([EUserRole.ADMIN, EUserRole.TEACHER])
  @IsString()
  role: EUserRole;

  @ApiProperty({
    description: '유저 계정',
    type: CreateUserAccountRequestType,
    isArray: true,
    required: true,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateUserAccountRequestType)
  accounts: CreateUserAccountRequestType[];
}

export class UpdateUserRequestType {
  @ApiProperty({ description: '이름', nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(10)
  name?: string;

  @ApiProperty({ description: '노출 이름', nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(10)
  displayName?: string;

  @ApiProperty({ description: '전화번호', nullable: true })
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ description: '생년월일', nullable: true })
  @IsDateString()
  @IsOptional()
  birthday?: Date;

  @ApiProperty({ description: '주소', nullable: true })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: '우편번호', nullable: true })
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiProperty({ description: '상세 주소', nullable: true })
  @IsString()
  @IsOptional()
  detailAddress?: string;

  @ApiProperty({ description: '역할', enum: EUserStatus, nullable: true })
  @IsString()
  @IsOptional()
  status?: EUserStatus;
}

export class UpdateUserRoleRequestType {
  @ApiProperty({ description: '역할', enum: EUserRole })
  @IsString()
  role: EUserRole;
}

export class UploadUserProfileImageRequestType {
  @ApiProperty({
    description: '이미지 파일 목록(png, jpg, jpeg',
    format: 'binary',
  })
  readonly files: Express.Multer.File[];
}
