import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { StudentService } from '../../services';
import {
  CreateStudentRequestType,
  GetStudentResponseType,
  StudentQueryRequestType,
  UpdateUserForInternalRequestType,
} from '../../types';

@ApiTags('[Internal] student')
@Controller({
  path: 'internal/students',
})
export class InternalStudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiOperation({
    summary: '인터널 학생 생성',
    description: '인터널 학생 생성',
  })
  @ApiOkResponse({ type: GetStudentResponseType })
  @Post('student')
  async createStudentForInternal(
    @Body() createStudentData: CreateStudentRequestType,
  ) {
    return this.studentService.createStudent({
      user: {
        id: createStudentData.userId,
        name: createStudentData.name,
        phoneNumber: createStudentData.phoneNumber,
        birthday: createStudentData.birthday,
      },
      student: {
        parentPhoneNumber: createStudentData.parentPhoneNumber,
        schoolName: createStudentData.schoolName,
        grade: createStudentData.grade,
        internalExamAverageScore: createStudentData.internalExamAverageScore,
        mockExamAverageScore: createStudentData.mockExamAverageScore,
      },
    });
  }

  @ApiOperation({
    summary: '인터널 학생 수정',
    description: '인터널 학생 수정',
  })
  @ApiOkResponse({ type: GetStudentResponseType })
  @Put('user-id/:userId')
  async updateStudentForInternal(
    @Param('userId') userId: number,
    @Body() updateUserData: UpdateUserForInternalRequestType,
  ) {
    return this.studentService.updateStudentByUserId(userId, {
      user: {
        name: updateUserData.name,
        phoneNumber: updateUserData.phoneNumber,
        birthday: updateUserData.birthday,
      },
    });
  }

  @ApiOperation({
    summary: '학생 목록 조회',
    description: '학생 목록 조회',
  })
  @ApiOkResponse({ type: [GetStudentResponseType] })
  @ApiBearerAuth('authentication')
  @Get()
  async listStudentForAdmin(@Query() query: StudentQueryRequestType) {
    return this.studentService.listStudent(query);
  }

  @ApiOperation({
    summary: '학생 조회',
    description: '학생 조회',
  })
  @ApiOkResponse({ type: [GetStudentResponseType] })
  @Get('student-id/:studentId')
  async getStudentById(@Param('studentId') studentId: number) {
    return this.studentService.getStudentById(studentId);
  }
}
