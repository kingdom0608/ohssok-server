import {
  Banner,
  DOMAINS,
  findPagination,
  responsePagination,
  Slot,
} from '@app/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ESlotErrorMessage } from '@app/common/enums/banner/banner-error-message.enum';
import { ESlotStatus } from '@app/common/enums/banner';
import { DataSource, Like, Repository } from 'typeorm';

@Injectable()
export class SlotService {
  constructor(
    @InjectDataSource(DOMAINS.Display)
    private dataSource: DataSource,
    @InjectRepository(Banner, DOMAINS.Display)
    private readonly bannerRepository: Repository<Banner>,
    @InjectRepository(Slot, DOMAINS.Display)
    private readonly slotRepository: Repository<Slot>,
  ) {}

  /**
   * 슬롯 생성
   * @param slotData
   */
  async createSlot(slotData: {
    title: string;
    status?: ESlotStatus;
    writerUserId: number;
  }): Promise<Slot> {
    const existingSlot = await this.slotRepository.findOne({
      where: { title: slotData.title },
    });

    if (existingSlot) {
      throw new BadRequestException(ESlotErrorMessage.SLOT_ALREADY_EXISTS);
    }

    const createSlot = this.slotRepository.create({
      ...slotData,
      status: slotData.status ? slotData.status : ESlotStatus.ACTIVE,
    });

    return this.slotRepository.save(createSlot);
  }

  /**
   * 슬롯 복수 조회
   * @param query
   */
  async listSlot(query: {
    offset?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    title?: string;
    status?: ESlotStatus;
    writerUserId?: number;
  }) {
    const { offset, page, size, sortBy, ...data } = query;
    const where: any = {
      ...data,
    };

    if (data.title) {
      where.title = Like(`%${data.title}%`);
    }

    const [list, total] = await this.slotRepository.findAndCount({
      where: where,
      ...findPagination({ offset, page, size, sortBy }),
    });

    const pagination = responsePagination(total, list.length, query);

    return { list: list, pagination: pagination };
  }

  /**
   * 슬롯 단일 조회
   * @param slotId
   */
  async getSlotById(slotId: number): Promise<Slot> {
    const slot = await this.slotRepository.findOne({
      where: {
        id: slotId,
      },
      relations: ['banners'],
    });

    if (!slot) {
      throw new BadRequestException(ESlotErrorMessage.SLOT_NOT_FOUND);
    }

    return slot;
  }

  /**
   * 슬롯 타이틀 조회
   * @param title
   */
  async getSlotByTitle(title: string): Promise<Slot> {
    const slot = await this.slotRepository.findOne({
      where: {
        title: title,
      },
      relations: ['banners'],
    });

    if (!slot) {
      throw new BadRequestException(ESlotErrorMessage.SLOT_NOT_FOUND);
    }

    return slot;
  }

  /**
   * 배너 슬롯 수정
   * @param id
   * @param updateSlotData
   */
  async updateSlotById(id: number, updateSlotData: any): Promise<Slot> {
    await this.getSlotById(id);

    /** 슬롯 업데이트 */
    await this.slotRepository.update(id, updateSlotData);

    return this.getSlotById(id);
  }

  /**
   * 배너 슬롯 삭제
   * @param id
   */
  async deleteSlotById(id: number): Promise<Slot> {
    const slot = await this.slotRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!slot) {
      throw new BadRequestException(ESlotErrorMessage.SLOT_NOT_FOUND);
    }

    /** 배너 삭제 */
    await this.bannerRepository.softDelete({
      slotId: id,
    });

    /** 슬롯 삭제 */
    await this.slotRepository.softDelete({
      id: id,
    });

    return slot;
  }
}
