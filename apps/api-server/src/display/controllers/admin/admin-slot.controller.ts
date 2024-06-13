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
  CurrentUser,
  EAuthenticationUserRole,
  UserRoleGuard,
} from '@app/authentication';
import {
  CreateSlotRequestType,
  UpdateSlotRequestType,
  SlotQueryRequestType,
  GetSlotResponseType,
} from '../../types';
import { SlotService } from '../../services';

@ApiTags('[admin] display')
@Controller({
  path: 'admin/slots',
})
export class AdminSlotController {
  constructor(private readonly slotService: SlotService) {}

  @ApiOperation({
    summary: '어드민 슬롯 생성',
    description: '어드민 슬롯 생성',
  })
  @ApiOkResponse({ type: GetSlotResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Post('slot')
  async createSlotForAdmin(
    @Body() slotData: CreateSlotRequestType,
    @CurrentUser() user,
  ) {
    return this.slotService.createSlot({ ...slotData, writerUserId: user.id });
  }

  @ApiOperation({
    summary: '어드민 슬롯 복수 조회',
    description: '어드민 슬롯 복수 조회',
  })
  @ApiOkResponse({ type: GetSlotResponseType })
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
  async listSlotForAdmin(@Query() query: SlotQueryRequestType) {
    return this.slotService.listSlot(query);
  }

  @ApiOperation({
    summary: '어드민 슬롯 조회',
    description: '어드민 슬롯 조회',
  })
  @ApiOkResponse({ type: GetSlotResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Get('slot-id/:soltId')
  async getSlotByIdForAdmin(@Param('soltId') soltId: number) {
    return this.slotService.getSlotById(soltId);
  }

  @ApiOperation({
    summary: '어드민 배너 슬롯 수정',
  })
  @ApiOkResponse({ type: GetSlotResponseType })
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth('authentication')
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Put('slot-id/:soltId')
  async updateSlotForAdmin(
    @CurrentUser() user,
    @Param('soltId') soltId: number,
    @Body() updateBannerSlotData: UpdateSlotRequestType,
  ) {
    return this.slotService.updateSlotById(soltId, {
      ...updateBannerSlotData,
      writerUserId: user.id,
    });
  }

  @ApiOperation({
    summary: '어드민 배너 슬롯 삭제',
    description: '어드민 배너 슬롯 삭제',
  })
  @ApiOkResponse({ type: GetSlotResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Delete('slot-id/:slotId')
  async deleteSlotForAdmin(@Param('slotId') slotId: number) {
    return await this.slotService.deleteSlotById(slotId);
  }
}
