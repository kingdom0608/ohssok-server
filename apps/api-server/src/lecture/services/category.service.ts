import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Category,
  DOMAINS,
  findPagination,
  responsePagination,
} from '@app/common';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category, DOMAINS.Lecture)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async listCategory(query) {
    const { offset, page, size, sortBy, ...data } = query;
    const where = {
      ...data,
    };

    const [list, total] = await this.categoryRepository.findAndCount({
      where: where,
      relations: ['upperCategory'],
      ...findPagination({ offset, page, size, sortBy }),
    });

    const pagination = responsePagination(total, list.length, query);

    return { list: list, pagination: pagination };
  }
}
