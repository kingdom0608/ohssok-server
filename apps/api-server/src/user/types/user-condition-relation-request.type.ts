import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateUserConditionRelationRequestType {
  userId: number;

  @ApiProperty({ description: '약관 ID' })
  @IsInt()
  conditionId: number;
}
