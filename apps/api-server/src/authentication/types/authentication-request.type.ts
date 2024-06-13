import { ApiProperty } from '@nestjs/swagger';
import { EUserRole } from '@app/common';

export class AuthenticationIssueTokenQueryRequestType {
  @ApiProperty({
    description: '유저 권한',
    enum: EUserRole,
    default: EUserRole.STUDENT,
  })
  role: EUserRole;
}
