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
import { TextbookService } from '../../services';
import {
  CreateTextbookRequestType,
  TextbookQueryRequestType,
  UpdateTextbookRequestType,
} from '../../types/textbook-request.type';
import { GetTextbookResponseType } from '../../types/textbook-response.type';
import { EImageStatus, InternalApiService } from '@app/common';

@ApiTags('[Admin] lecture')
@Controller({
  path: 'admin/textbooks',
})
export class AdminTextbookController {
  constructor(
    private readonly textbookService: TextbookService,
    private readonly internalApiService: InternalApiService,
  ) {}

  @ApiOperation({
    summary: '교재 생성',
    description: '교재 생성',
  })
  @ApiOkResponse({ type: GetTextbookResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
    ]),
  )
  @Post('textbook')
  async createTextbookForAdmin(
    @Body() textbookData: CreateTextbookRequestType,
  ) {
    return this.textbookService.createTextbook(textbookData);
  }

  @ApiOperation({
    summary: '어드민 교재 목록 조회',
    description: '어드민 교재 목록 조회',
  })
  @ApiOkResponse({ type: GetTextbookResponseType })
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
  async listTextbookForAdmin(@Query() query: TextbookQueryRequestType) {
    return this.textbookService.listTextbook(query);
  }

  @ApiOperation({
    summary: '어드민 교재 수정',
  })
  @ApiOkResponse({ type: GetTextbookResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Put('textbook-id/:textbookId')
  async updateTextbookByIdForAdmin(
    @Param('textbookId') textbookId: number,
    @Body() updateTextbookData: UpdateTextbookRequestType,
  ) {
    if (updateTextbookData.imageId) {
      const getTextbook = await this.textbookService.getTextbookById(
        textbookId,
      );

      await this.internalApiService.put(
        `internal/images/image-ids/${getTextbook.imageId}`,
        {
          status: EImageStatus.INACTIVE,
        },
      );
    }

    return this.textbookService.updateTextbookById(
      textbookId,
      updateTextbookData,
    );
  }

  @ApiOperation({
    summary: '어드민 교재 삭제',
  })
  @ApiOkResponse({ type: GetTextbookResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Delete('textbook-id/:textbookId')
  async deleteTextbookByIdForAdmin(@Param('textbookId') textbookId: number) {
    return this.textbookService.deleteTextbookById(textbookId);
  }
}
