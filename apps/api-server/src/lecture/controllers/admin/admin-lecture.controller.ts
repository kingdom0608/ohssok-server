import {
  ApiBearerAuth,
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
  UseGuards,
} from '@nestjs/common';
import {
  AuthenticationGuard,
  EAuthenticationUserRole,
  UserRoleGuard,
} from '@app/authentication';
import {
  CreateLectureRequestType,
  GetLectureResponseType,
  LectureQueryRequestType,
  UpdateLectureRequestType,
} from '../../types';
import { LectureService } from '../../services';
import { shortNumberId, SqsService } from '@app/common';

@ApiTags('[Admin] lecture')
@Controller({
  path: 'admin/lectures',
})
export class AdminLectureController {
  constructor(
    private readonly lectureService: LectureService,
    private readonly sqsService: SqsService,
  ) {}

  @ApiOperation({
    summary: '강의 생성',
    description: '강의 생성',
  })
  @ApiOkResponse({ type: GetLectureResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Post('lecture')
  async createLecture(@Body() lectureData: CreateLectureRequestType) {
    return this.lectureService.createLecture(lectureData);
  }

  @ApiOperation({
    summary: '강의 수정',
    description: '강의 수정',
  })
  @ApiOkResponse({ type: GetLectureResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Put('lecture-id/:lectureId')
  async updateLectureForAdmin(
    @Param('lectureId') lectureId: number,
    @Body() lectureData: UpdateLectureRequestType,
  ) {
    const updateLecture = await this.lectureService.updateLecture(
      lectureId,
      lectureData,
    );

    await this.sqsService.sendEventMessage({
      pattern: 'UPDATE_LECTURE',
      requester: shortNumberId(10),
      data: {
        lecture: {
          ...updateLecture,
        },
      },
    });
    return updateLecture;
  }

  @ApiOperation({
    summary: '강의 조회',
    description: '강의 조회',
  })
  @ApiOkResponse({ type: GetLectureResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Get('lecture-id/:lectureId')
  async getLectureByIdForAdmin(@Param('lectureId') lectureId: number) {
    return this.lectureService.getLectureById(lectureId);
  }

  @ApiOperation({
    summary: '어드민 강의 목록 조회',
    description: '어드민 강의 목록 조회',
  })
  @ApiOkResponse({ type: GetLectureResponseType })
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
  async listLectureForAdmin(@Query() query: LectureQueryRequestType) {
    return this.lectureService.listLecture(query);
  }

  @ApiOperation({
    summary: '강의 삭제',
    description: '강의 삭제',
  })
  @ApiOkResponse({ type: GetLectureResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Delete('lecture-id/:lectureId')
  async deleteLecture(@Param('lectureId') lectureId: number) {
    return this.lectureService.deleteLectureById(lectureId);
  }
}
