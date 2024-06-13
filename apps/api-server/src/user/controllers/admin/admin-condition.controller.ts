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
import { ConditionService } from '../../services';
import {
  CreateConditionRequestType,
  GetConditionResponseType,
  ListConditionQueryRequestType,
  UpdateConditionRequestType,
} from '../../types';

@ApiTags('[Admin] user')
@Controller({
  path: 'admin/conditions',
})
export class AdminConditionController {
  constructor(private readonly conditionService: ConditionService) {}
  @ApiOperation({
    summary: '어드민 약관 생성',
    description: '어드민 약관 생성',
  })
  @ApiOkResponse({ type: GetConditionResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
    ]),
  )
  @Post()
  async createCondition(@Body() conditionDate: CreateConditionRequestType) {
    return this.conditionService.createCondition({
      ...conditionDate,
    });
  }

  @ApiOperation({
    summary: '어드민 약관 목록',
    description: '어드민 약관 목록',
  })
  @ApiOkResponse({ type: [GetConditionResponseType] })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
    ]),
  )
  @Get()
  async listCondition(@Query() query: ListConditionQueryRequestType) {
    return this.conditionService.listCondition({
      ...query,
    });
  }

  @ApiOperation({
    summary: '어드민 약관 업데이트',
    description: '어드민 약관 업데이트',
  })
  @ApiOkResponse({ type: [GetConditionResponseType] })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
    ]),
  )
  @Put('/condition-id/:conditionId')
  async updateCondition(
    @Param('conditionId') conditionId: number,
    @Body() conditionData: UpdateConditionRequestType,
  ) {
    return this.conditionService.updateConditionById(
      conditionId,
      conditionData,
    );
  }

  @ApiOperation({
    summary: '어드민 약관 삭제',
    description: '어드민 약관 삭제',
  })
  @ApiOkResponse({ type: [GetConditionResponseType] })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
    ]),
  )
  @Delete('/condition-id/:conditionId')
  async deleteCondition(@Param('conditionId') conditionId: number) {
    return this.conditionService.deleteConditionById(conditionId);
  }
}
