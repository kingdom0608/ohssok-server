import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { UpperCategoryService } from '../../services';
import {
  GetUpperCategoryResponseType,
  UpperCategoryQueryRequestType,
} from '../../types';

@ApiTags('[Public] category')
@Controller({
  path: 'public/upper-categories',
})
export class PublicUpperCategoryController {
  constructor(private readonly upperCategoryService: UpperCategoryService) {}
  @ApiOperation({
    summary: '상위 카테고리 목록 조회',
    description: '상위 카테고리 목록 조회',
  })
  @ApiOkResponse({ type: GetUpperCategoryResponseType })
  @Get()
  async listUpperCategory(@Query() query: UpperCategoryQueryRequestType) {
    return this.upperCategoryService.listUpperCategory(query);
  }
}
