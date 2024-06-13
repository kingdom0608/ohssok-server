import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UpperCategory,
  DOMAINS,
  findPagination,
  responsePagination,
  IResponsePagination,
} from '@app/common';
import { Repository } from 'typeorm';

@Injectable()
export class UpperCategoryService {
  constructor(
    @InjectRepository(UpperCategory, DOMAINS.Lecture)
    private readonly UpperCategoryRepository: Repository<UpperCategory>,
  ) {}

  async listUpperCategory(query): Promise<{
    list: UpperCategory[];
    pagination: IResponsePagination;
  }> {
    const { offset, page, size, sortBy, ...data } = query;
    const where = {
      ...data,
    };

    const [list, total] = await this.UpperCategoryRepository.findAndCount({
      relations: ['categories'],
      where: where,
      ...findPagination({ offset, page, size, sortBy }),
    });

    const pagination = responsePagination(total, list.length, query);

    return { list: list, pagination: pagination };
  }
}
