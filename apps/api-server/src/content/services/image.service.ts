import {
  DOMAINS,
  EImageErrorMessageEnum,
  EImageStatus,
  Image,
  shortNumberId,
} from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image, DOMAINS.Content)
    private readonly imageRepository: Repository<Image>,
  ) {}

  /**
   * 이미지 업로드
   * @param imageData
   */
  async createImage(imageData: {
    originalFileName: string;
    fileSize: number;
    extension: string;
    target?: string;
  }) {
    const fileName = `${imageData.originalFileName}_${shortNumberId(10)}`;
    const image = this.imageRepository.create({
      ...imageData,
      fileName: fileName,
      status: EImageStatus.INACTIVE,
      key: `images/${fileName}.${imageData.extension}`,
      url: `https://${process.env.AWS_S3_PUBLIC_BUCKET}.s3.ap-northeast-2.amazonaws.com/images/${fileName}.${imageData.extension}`,
    });

    return this.imageRepository.save(image);
  }

  /**
   * 이미지 조회
   * @param id
   */
  async getImageById(id: number): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!image) {
      throw new NotFoundException(EImageErrorMessageEnum.IMAGE_NOT_FOUND);
    }

    return image;
  }

  /**
   * 이미지 상태 변경
   * @param imageIds
   * @param updateImageData
   */
  async updateImagesStatus(
    imageIds: string,
    updateImageData: { status: EImageStatus },
  ): Promise<Image[]> {
    const splitId = imageIds.split(',').map((x) => parseInt(x));

    await this.imageRepository.update(
      {
        id: In(splitId),
      },
      {
        ...updateImageData,
      },
    );

    return await this.imageRepository.find({
      where: {
        id: In(splitId),
      },
    });
  }
}
