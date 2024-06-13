import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DOMAINS,
  ETextbookStatus,
  findPagination,
  responsePagination,
} from '@app/common';
import { Textbook } from '@app/common/entities/lecture/textbook.entity';
import { Repository } from 'typeorm';
import { ETextbookErrorMessage } from '@app/common/enums/lecture/textbook.enum';

@Injectable()
export class TextbookService {
  constructor(
    @InjectRepository(Textbook, DOMAINS.Lecture)
    private readonly textbookRepository: Repository<Textbook>,
  ) {}

  /**
   * 교재 생성
   * @param textbookData
   */
  async createTextbook(textbookData: {
    imageId: number;
    imageUrl: string;
    name: string;
    author: string;
    page: string;
    size: string;
    description: string;
    publishDate: Date;
  }) {
    return await this.textbookRepository.save({
      ...textbookData,
      status: ETextbookStatus.ACTIVE,
    });
  }

  async listTextbook(query) {
    const { offset, page, size, sortBy, ...data } = query;
    const where = {
      ...data,
    };

    const [list, total] = await this.textbookRepository.findAndCount({
      where: where,
      ...findPagination({ offset, page, size, sortBy }),
    });

    const pagination = responsePagination(total, list.length, query);

    return { list: list, pagination: pagination };
  }

  /**
   * 교재 조회
   * @param id
   */
  async getTextbookById(id: number) {
    const findTextbook = await this.textbookRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!findTextbook) {
      throw new NotFoundException(ETextbookErrorMessage.TEXTBOOK_NOT_FOUND);
    }

    return findTextbook;
  }

  /**
   * 교재 수정
   * @param id
   * @param textBookData
   */
  async updateTextbookById(
    id: number,
    textBookData: {
      imageId?: number;
      imageUrl?: string;
      name?: string;
      status?: ETextbookStatus;
      author?: string;
      page?: string;
      size?: string;
      description?: string;
      publishDate?: Date;
    },
  ) {
    await this.textbookRepository.update(
      {
        id: id,
      },
      textBookData,
    );

    return this.getTextbookById(id);
  }

  /**
   * 교재 삭제
   * @param id
   */
  async deleteTextbookById(id: number) {
    const findTextbook = await this.getTextbookById(id);

    await this.textbookRepository.softDelete({
      id: id,
    });

    return findTextbook;
  }
}
