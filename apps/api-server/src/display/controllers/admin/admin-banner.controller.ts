import {
  ApiBearerAuth,
  ApiConsumes,
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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { S3Service, shortNumberId } from '@app/common';
import {
  AuthenticationGuard,
  CurrentUser,
  EAuthenticationUserRole,
  UserRoleGuard,
} from '@app/authentication';
import {
  BannerQueryRequestType,
  CreateBannerRequestType,
  GetBannerResponseType,
  UpdateBannerRequestType,
} from '../../types';
import { BannerService } from '../../services';

@ApiTags('[admin] display')
@Controller({
  path: 'admin/banners',
})
export class AdminBannerController {
  constructor(
    private readonly bannerService: BannerService,
    private readonly s3Service: S3Service,
  ) {}

  @ApiOperation({
    summary: '어드민 배너 생성',
    description: '어드민 배너 생성',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: GetBannerResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 1 }]))
  @Post('banner')
  async createBanner(
    @CurrentUser() user,
    @Body() bannerData: CreateBannerRequestType,
    @UploadedFiles() upload: ParameterDecorator,
  ) {
    const createBanner = await this.bannerService.createBanner({
      ...bannerData,
      writerUserId: user.id,
    });

    const images: Express.Multer.File[] = upload['files'] || [];
    const uploadImage = images.map((image: Express.Multer.File) => {
      return {
        image,
        key: `banners/${createBanner.id}-${shortNumberId(6)}`,
      };
    });

    const [image] = await this.s3Service.createPublicImageFiles(uploadImage);

    await this.bannerService.updateBannerById(createBanner.id, {
      imageUrl: image?.url,
    });

    return this.bannerService.getBannerById(createBanner.id);
  }

  @ApiOperation({
    summary: '어드민 배너 복수 조회',
    description: '어드민 배너 복수 조회',
  })
  @ApiOkResponse({ type: GetBannerResponseType })
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
  async listBannerForAdmin(@Query() query: BannerQueryRequestType) {
    return this.bannerService.listBanner(query);
  }

  @ApiOperation({
    summary: '어드민 배너 수정',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: GetBannerResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 1 }]))
  @Put('banner-id/:bannerId')
  async updateBannerByIdForAdmin(
    @CurrentUser() user,
    @Param('bannerId') bannerId: number,
    @Body() updateBannerData: UpdateBannerRequestType,
    @UploadedFiles() upload: ParameterDecorator,
  ) {
    const images: Express.Multer.File[] = upload['files'] || [];
    if (images.length > 0) {
      const uploadImage = images.map((image: Express.Multer.File) => {
        return {
          image,
          key: `banners/${bannerId}-${shortNumberId(6)}`,
        };
      });

      const [image] = await this.s3Service.createPublicImageFiles(uploadImage);
      updateBannerData.imageUrl = image?.url || '';
    }

    return this.bannerService.updateBannerById(bannerId, {
      ...updateBannerData,
      writerUserId: user.id,
    });
  }

  @ApiOperation({
    summary: '어드민 배너 삭제',
    description: '어드민 배너 삭제',
  })
  @ApiOkResponse({ type: GetBannerResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @Delete('banner-id/:bannerId')
  async deleteBannerByIdForAdmin(@Param('bannerId') bannerId: number) {
    return await this.bannerService.deleteBannerById(bannerId);
  }
}
