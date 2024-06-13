import {
  DOMAINS,
  EImageStatus,
  findPagination,
  InternalApiService,
  Notice,
  responsePagination,
} from '@app/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

import { DataSource, In, Like, Repository } from 'typeorm';
import { ENoticeCategory, ENoticeStatus } from '@app/common/enums/notice';
import { ENoticeErrorMessage } from '@app/common/enums/notice/notice-error-message.enum';

@Injectable()
export class NoticeService {
  constructor(
    @InjectDataSource(DOMAINS.Notice)
    private dataSource: DataSource,
    @InjectRepository(Notice, DOMAINS.Notice)
    private readonly noticeRepository: Repository<Notice>,
    private readonly internalApiService: InternalApiService,
  ) {}
  /**
   * 공지사항 생성
   * @param noticeData
   */
  async createNotice(noticeData: {
    title: string;
    contents: string;
    category: ENoticeCategory;
    status: ENoticeStatus;
    imageIds?: string[];
  }): Promise<Notice> {
    const createNotice = this.noticeRepository.create({
      ...noticeData,
      status: noticeData.status ? noticeData.status : ENoticeStatus.ACTIVE,
    });

    if (noticeData.imageIds) {
      await this.internalApiService.put(
        `internal/images/image-ids/${noticeData.imageIds.join(',')}`,
        {
          status: EImageStatus.ACTIVE,
        },
      );
    }
    return this.noticeRepository.save(createNotice);
  }

  /**
   * 공지사항 복수 조회
   * @param query
   */
  async listNotice(query) {
    const { offset, page, size, sortBy, ...data } = query;
    const where = {
      ...data,
    };
    if (data.title) {
      where.title = Like(`%${data.title}%`);
    }

    if (data.contents) {
      where.contents = Like(`%${data.contents}%`);
    }

    if (data.category) {
      delete where.category;
      where.category = In(data.category.split(','));
    }

    if (data.status) {
      delete where.status;
      where.status = In(data.status.split(','));
    }

    const [list, total] = await this.noticeRepository.findAndCount({
      where: where,
      ...findPagination({ offset, page, size, sortBy }),
    });

    const pagination = responsePagination(total, list.length, query);

    return { list: list, pagination: pagination };
  }

  /**
   * 공지사항 단일 조회
   * @param id
   */
  async getNoticeById(id: number): Promise<Notice> {
    const notice = await this.noticeRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!notice) {
      throw new BadRequestException(ENoticeErrorMessage.NOTICE_NOT_FOUND);
    }
    return notice;
  }

  /**
   * Active인 공지사항 단일 조회
   * @param id
   */
  async getActiveNoticeById(id: number): Promise<Notice> {
    const notice = await this.noticeRepository.findOne({
      where: {
        id: id,
        status: ENoticeStatus.ACTIVE,
      },
    });

    if (!notice) {
      throw new BadRequestException(ENoticeErrorMessage.NOTICE_NOT_FOUND);
    }
    return notice;
  }

  /**
   * 공지사항 수정
   * @param id
   * @param updateNoticeData
   */
  async updateNoticeById(
    id: number,
    updateNoticeData: {
      title?: string;
      contents?: string;
      category?: ENoticeCategory;
      status?: ENoticeStatus;
      imageIds?: string[];
    },
  ): Promise<Notice> {
    if (updateNoticeData.imageIds) {
      await this.internalApiService.put(
        `internal/images/image-ids/${updateNoticeData.imageIds.join(',')}`,
        {
          status: EImageStatus.ACTIVE,
        },
      );
    }

    /** 공지사항 업데이트 */
    delete updateNoticeData.imageIds;

    await this.noticeRepository.update(id, updateNoticeData);

    return this.getNoticeById(id);
  }

  /**
   * 공지사항 삭제
   * @param id
   */
  async deleteNoticeById(id: number): Promise<Notice> {
    const notice = await this.getNoticeById(id);

    /** 배너 삭제 */
    await this.noticeRepository.softDelete({
      id: id,
    });

    return notice;
  }
}
