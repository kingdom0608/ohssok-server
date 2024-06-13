import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Param, Put } from '@nestjs/common';
import { ImageService } from '../../services';
import {
  GetImageResponseType,
  UpdateImagesForInternalRequestType,
} from '../../types';

@ApiTags('[Internal] images')
@Controller({
  path: 'internal/images',
})
export class InternalImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({
    summary: '인터널 이미지 상태 수정',
    description: '인터널 이미지 상태 수정',
  })
  @ApiOkResponse({ type: [GetImageResponseType] })
  @Put('image-ids/:imageIds')
  async updateImageForInternal(
    @Param('imageIds') imageIds: string,
    @Body() updateImageData: UpdateImagesForInternalRequestType,
  ) {
    return await this.imageService.updateImagesStatus(imageIds, {
      ...updateImageData,
    });
  }
}
