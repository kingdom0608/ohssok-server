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
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DOMAINS, S3Service } from '@app/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ImageService } from '../../services';
import {
  AuthenticationGuard,
  EAuthenticationUserRole,
  UserRoleGuard,
} from '@app/authentication';
import {
  CreateImageUploadUrlRequestType,
  CreateImageUploadUrlResponseType,
  UploadImageRequestType,
  UploadImageResponseType,
} from '../../types';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('[Admin] image')
@Controller({
  path: 'admin/images',
})
export class AdminImageController {
  private readonly publicBucket;

  constructor(
    @InjectDataSource(DOMAINS.Content)
    private dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
    private readonly imageService: ImageService,
  ) {
    this.publicBucket = this.configService.get<string>('AWS_S3_PUBLIC_BUCKET');
  }

  @ApiOperation({
    summary: '이미지 업로드 url 발급',
    description: '이미지 업로드 url 발급',
  })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @ApiOkResponse({ type: CreateImageUploadUrlResponseType })
  @Post('image/url')
  async createUploadImageUrl(
    @Body() uploadImageData: CreateImageUploadUrlRequestType,
  ) {
    const image = await this.imageService.createImage(uploadImageData);

    const signedUrl = await this.s3Service.createSignUrl({
      bucket: this.publicBucket,
      key: image.key,
    });

    return {
      id: image.id,
      uploadUrl: signedUrl,
      fileName: image.fileName,
      url: image.url,
    };
  }

  @ApiOperation({
    summary: 'S3 이미지 생성',
    description: 'S3 이미지 생성 - 서버 테스트용',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: UploadImageResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @UseGuards(
    UserRoleGuard([
      EAuthenticationUserRole.OWNER,
      EAuthenticationUserRole.ADMIN,
      EAuthenticationUserRole.TEACHER,
    ]),
  )
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 1 }]))
  @Post('image')
  async uploadImage(
    @Body() imageData: UploadImageRequestType,
    @UploadedFiles() upload: ParameterDecorator,
  ) {
    const createImage = await this.imageService.createImage(imageData);

    const images: Express.Multer.File[] = upload['file'] || [];

    const uploadImage = images.map((image: Express.Multer.File) => {
      return {
        image,
        key: createImage.key,
      };
    });

    const [image] = await this.s3Service.createPublicImageFiles(uploadImage);

    return { url: image.url };
  }
}
