import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Banner,
  Slot,
  DOMAINS,
  findPagination,
  responsePagination,
} from '@app/common';
import {
  EBannerErrorMessage,
  ESlotErrorMessage,
} from '@app/common/enums/banner/banner-error-message.enum';
import { EBannerPlatform, EBannerStatus } from '@app/common/enums/banner';
import { Repository } from 'typeorm';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner, DOMAINS.Display)
    private readonly bannerRepository: Repository<Banner>,
    @InjectRepository(Slot, DOMAINS.Display)
    private readonly slotRepository: Repository<Slot>,
  ) {}

  /**
   * 배너 생성
   * @param bannerData
   */
  async createBanner(bannerData: {
    slotId: number;
    sequence: number;
    url?: string;
    title: string;
    description?: string;
    platform: EBannerPlatform;
    imageUrl?: string;
    status?: EBannerStatus;
    writerUserId?: number;
  }): Promise<Banner> {
    const bannerSlot = await this.slotRepository.findOne({
      where: { id: bannerData.slotId },
    });

    if (!bannerSlot) {
      throw new BadRequestException(ESlotErrorMessage.SLOT_NOT_FOUND);
    }

    const createBanner = this.bannerRepository.create({
      ...bannerData,
      status: bannerData.status ? bannerData.status : EBannerStatus.ACTIVE,
    });

    return this.bannerRepository.save(createBanner);
  }

  /**
   * 배너 단일 조회
   * @param id
   */
  async getBannerById(id: number): Promise<Banner> {
    console.log(id);
    const banner = await this.bannerRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!banner) {
      throw new BadRequestException(EBannerErrorMessage.BANNER_NOT_FOUND);
    }

    return banner;
  }

  /**
   * 배너 복수 조회
   * @param query
   */
  async listBanner(query: {
    offset?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    slotId?: number;
    status?: EBannerStatus;
    writerUserId?: number;
  }) {
    const { offset, page, size, sortBy, ...data } = query;
    const where = {
      ...data,
    };

    const [list, total] = await this.bannerRepository.findAndCount({
      where: where,
      ...findPagination({ offset, page, size, sortBy }),
    });

    const pagination = responsePagination(total, list.length, query);

    return { list: list, pagination: pagination };
  }

  /**
   * 배너 수정
   * @param id
   * @param updateBannerData
   */
  async updateBannerById(
    id: number,
    updateBannerData: {
      slotId?: number;
      sequence?: number;
      url?: string;
      title?: string;
      description?: string;
      platform?: EBannerPlatform;
      imageUrl?: string;
      status?: EBannerStatus;
      writerUserId?: number;
    },
  ): Promise<Banner> {
    await this.getBannerById(id);

    /** 배너 업데이트 */
    await this.bannerRepository.update(id, updateBannerData);

    return this.getBannerById(id);
  }

  /**
   * 배너 삭제
   * @param id
   */
  async deleteBannerById(id: number): Promise<Banner> {
    const banner = await this.getBannerById(id);

    /** 배너 삭제 */
    await this.bannerRepository.softDelete({
      id: id,
    });

    return banner;
  }
}
