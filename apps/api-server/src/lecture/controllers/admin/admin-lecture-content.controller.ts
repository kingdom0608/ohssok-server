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
import { DOMAINS } from '@app/common';
import {
  AuthenticationGuard,
  EAuthenticationUserRole,
  UserRoleGuard,
} from '@app/authentication';
import {
  CreateLectureContentRequestType,
  GetLectureContentResponseType,
  LectureContentQueryRequestType,
  UpdateLectureContentRequestType,
} from '../../types';
import { LectureContentService, LectureService } from '../../services';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@ApiTags('[Admin] lecture contents')
@Controller({
  path: 'admin/lecture-contents',
})
export class AdminLectureContentController {
  constructor(
    @InjectDataSource(DOMAINS.Lecture)
    private dataSource: DataSource,
    private readonly lectureService: LectureService,
    private readonly lectureContentService: LectureContentService,
  ) {}

  @ApiOperation({
    summary: '강의 영상 컨텐츠 생성',
    description: '강의 영상 컨텐츠 생성',
  })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @ApiOkResponse({ type: GetLectureContentResponseType })
  @Post('lecture-content')
  async createLectureContentForAdmin(
    @Body() lectureContentData: CreateLectureContentRequestType,
  ) {
    /** 강의 조회 */
    await this.lectureService.getLectureById(lectureContentData.lectureId);

    /** 강의 컨텐츠 생성 */
    return await this.lectureContentService.createLectureContent({
      ...lectureContentData,
    });
  }

  @ApiOperation({
    summary: '강의 컨텐츠 조회',
    description: '강의 컨텐츠 조회',
  })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @ApiOkResponse({ type: GetLectureContentResponseType })
  @Get()
  async listLectureContentForAdmin(
    @Query() query: LectureContentQueryRequestType,
  ) {
    return this.lectureContentService.listLectureContent(query);
  }

  @ApiOperation({
    summary: '강의 영상 컨텐츠 수정',
    description: '강의 영상 컨텐츠 수정',
  })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @ApiOkResponse({ type: GetLectureContentResponseType })
  @Put('lecture-content-id/:lectureContentId')
  async updateLectureContentForAdmin(
    @Param('lectureContentId') lectureContentId: number,
    @Body() lectureContentData: UpdateLectureContentRequestType,
  ) {
    return await this.lectureContentService.updateLectureContent(
      lectureContentId,
      {
        ...lectureContentData,
      },
    );
  }

  @ApiOperation({
    summary: '강의 영상 컨텐츠 삭제',
    description: '강의 영상 컨텐츠 삭제',
  })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @ApiOkResponse({ type: GetLectureContentResponseType })
  @Delete('lecture-content-id/:lectureContentId')
  async deleteLectureContentForAdmin(
    @Param('lectureContentId') lectureContentId: number,
  ) {
    return await this.lectureContentService.deleteLectureContentById(
      lectureContentId,
    );
  }
}
