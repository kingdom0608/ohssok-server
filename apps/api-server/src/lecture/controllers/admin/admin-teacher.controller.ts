import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  AuthenticationGuard,
  EAuthenticationUserRole,
  UserRoleGuard,
} from '@app/authentication';
import { TeacherService } from '../../services';
import {
  CreateTeacherRequestType,
  TeacherQueryRequestType,
  UpdateTeacherRequestType,
  UploadTeacherImageRequestType,
  UploadTeacherProfileImageResponseType,
} from '../../types/teacher-request.type';
import { GetTeacherResponseType } from '../../types/teacher-response.type';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { S3Service } from '@app/common';

@ApiTags('[Admin] lecture')
@Controller({
  path: 'admin/teachers',
})
export class AdminTeacherController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly teacherService: TeacherService,
  ) {}

  @ApiOperation({
    summary: '어드민 강사 생성',
    description: '어드민 강사 생성',
  })
  @ApiOkResponse({ type: GetTeacherResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
    ]),
  )
  @Post('teacher')
  async createTeacherForAdmin(@Body() teacherData: CreateTeacherRequestType) {
    return this.teacherService.createTeacher(teacherData);
  }

  @ApiOperation({
    summary: '어드민 강사 목록 조회',
    description: '어드민 강사 목록 조회',
  })
  @ApiOkResponse({ type: GetTeacherResponseType })
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
  async listTeacherForAdmin(@Query() query: TeacherQueryRequestType) {
    return this.teacherService.listTeacher(query);
  }

  @ApiOperation({
    summary: '어드민 강사 조회',
    description: '어드민 강사 조회',
  })
  @ApiOkResponse({ type: GetTeacherResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Get('teacher-id/:teacherId')
  async getTeacherByIdForAdmin(@Param('teacherId') teacherId: number) {
    return this.teacherService.getTeacherById(teacherId);
  }

  @ApiOperation({
    summary: '어드민 강사 삭제',
    description: '어드민 강사 삭제',
  })
  @ApiOkResponse({ type: GetTeacherResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
    ]),
  )
  @Delete('teacher-id/:teacherId')
  async deleteTeacherForAdmin(@Param('teacherId') teacherId: number) {
    return this.teacherService.deleteTeacherById(teacherId);
  }

  @ApiOperation({
    summary: '어드민 강사 수정',
  })
  @ApiOkResponse({ type: GetTeacherResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Put('teacher-id/:teacherId')
  async updateTeacherByIdForAdmin(
    @Param('teacherId') teacherId: number,
    @Body() updateTeacherData: UpdateTeacherRequestType,
  ) {
    return this.teacherService.updateTeacherById(teacherId, updateTeacherData);
  }

  @ApiOperation({
    summary: '강사 프로필 이미지 Url 생성',
    description: '강사 프로필 이미지 Url 생성',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  @ApiOkResponse({ type: [UploadTeacherProfileImageResponseType] })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Post('teacher/profile')
  async createTeacherProfileImageUrlForAdmin(
    @Body() uploadTeacherImageData: UploadTeacherImageRequestType,
    @UploadedFiles() upload: ParameterDecorator,
  ) {
    const { teacherId } = uploadTeacherImageData;
    const images: Express.Multer.File[] = upload['files'] || [];
    const uploadImage = images.map((image: Express.Multer.File) => {
      return {
        image,
        key: `profiles/teachers/${teacherId}`,
      };
    });

    return this.s3Service.createPublicImageFiles(uploadImage);
  }
}
