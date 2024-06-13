import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { InternalApiService } from '@app/common';
import {
  AuthenticationGuard,
  EAuthenticationUserRole,
  UserRoleGuard,
} from '@app/authentication';
import { StudentService } from '../../services';
import {
  GetStudentResponseType,
  StudentQueryRequestType,
  UpdateStudentRequestType,
} from '../../types';

@ApiTags('[Admin] student')
@Controller({
  path: 'admin/students',
})
export class AdminStudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly internalApiService: InternalApiService,
  ) {}

  @ApiOperation({
    summary: '어드민 학생 목록 조회',
    description: '어드민 학생 목록 조회',
  })
  @ApiOkResponse({ type: [GetStudentResponseType] })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Get()
  async listStudentForAdmin(@Query() query: StudentQueryRequestType) {
    return this.studentService.listStudent(query);
  }

  @ApiOperation({
    summary: '어드민 학생 조회',
    description: '어드민 학생 조회',
  })
  @ApiOkResponse({ type: GetStudentResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Get('student-id/:studentId')
  async getStudentByIdForAdmin(@Param('studentId') studentId: number) {
    const student = await this.studentService.getStudentById(studentId);

    const GET_USER = 'internal/users/user-id';

    const user = await this.internalApiService.get(
      `${GET_USER}/${student.userId}`,
    );

    return {
      ...student,
      user: user,
    };
  }

  @ApiOperation({
    summary: '어드민 학생 수정',
    description: '어드민 학생 수정',
  })
  @ApiOkResponse({ type: GetStudentResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Put('student-id/:studentId')
  async updateStudentByIdForAdmin(
    @Param('studentId') studentId: number,
    @Body() updateStudentData: UpdateStudentRequestType,
  ) {
    await this.studentService.updateStudentById(studentId, {
      ...updateStudentData,
    });

    return this.studentService.getStudentById(studentId);
  }
}
