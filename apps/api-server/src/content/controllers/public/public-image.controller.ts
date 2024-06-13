import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { ImageService } from '../../services';
import { InjectDataSource } from '@nestjs/typeorm';
import { DOMAINS } from '@app/common';
import { DataSource } from 'typeorm';
import { GetImageResponseType } from '../../types';
@ApiTags('[Public] image')
@Controller({
  path: 'public/images',
})
export class PublicImageController {
  constructor(
    @InjectDataSource(DOMAINS.Content)
    private dataSource: DataSource,
    private readonly imageService: ImageService,
  ) {}

  @ApiOperation({
    summary: '이미지 조회',
    description: '이미지 조회',
  })
  @ApiOkResponse({ type: GetImageResponseType })
  @Get('image-id/:imageId')
  async getImageById(@Param('imageId') imageId: number) {
    return await this.imageService.getImageById(imageId);
  }
}
