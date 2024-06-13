import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { GetSlotResponseType } from '../../types';
import { SlotService } from '../../services';

@ApiTags('[Public] display')
@Controller({
  path: 'public/slots',
})
export class PublicSlotController {
  constructor(private readonly slotService: SlotService) {}

  @ApiOperation({
    summary: '슬롯 목록 조회',
    description: '슬롯 목록 조회',
  })
  @ApiOkResponse({ type: GetSlotResponseType })
  @Get('slot-tile/:slotTitle')
  async getSlotBySlotTitle(@Param('slotTitle') slotTitle: string) {
    return this.slotService.getSlotByTitle(slotTitle);
  }
}
