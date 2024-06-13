import { TextbookService } from '../../services';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetTextbookResponseType } from '../../types/textbook-response.type';
import { Controller, Get, Param } from '@nestjs/common';

@ApiTags('[Public] lecture')
@Controller({
  path: 'public/textbooks',
})
export class PublicTextbookController {
  constructor(private readonly textbookService: TextbookService) {}

  @ApiOperation({
    summary: '교재 조회',
    description: '교재 조회',
  })
  @ApiOkResponse({ type: GetTextbookResponseType })
  @Get('textbook-id/:textbookId')
  async getTextbookById(@Param('textbookId') textbookId: number) {
    return this.textbookService.getTextbookById(textbookId);
  }
}
