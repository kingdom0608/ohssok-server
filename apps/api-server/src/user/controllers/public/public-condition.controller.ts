import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { EConditionStatus } from '@app/common';
import { ConditionService } from '../../services';
import {
  GetConditionResponseType,
  ListConditionQueryRequestType,
} from '../../types';

@ApiTags('[Public] user')
@Controller({
  path: 'public',
})
export class PublicConditionController {
  constructor(private readonly conditionService: ConditionService) {}
  @ApiOperation({
    summary: '약관 목록',
    description: '약관 목록',
  })
  @ApiOkResponse({ type: [GetConditionResponseType] })
  @Get('/conditions')
  async listCondition(@Query() query: ListConditionQueryRequestType) {
    return this.conditionService.listCondition({
      ...query,
      status: EConditionStatus.ACTIVE,
    });
  }
}
