import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DOMAINS,
  ETeacherErrorMessage,
  ETeacherStatus,
  findPagination,
  responsePagination,
  Teacher,
} from '@app/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class TeacherService {
  constructor(
    @InjectDataSource(DOMAINS.Lecture)
    private dataSource: DataSource,
    @InjectRepository(Teacher, DOMAINS.Lecture)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  /**
   * 강사 생성
   * @param teacherData
   */
  async createTeacher(teacherData: {
    name: string;
    description: string;
    profileImageUrl?: string;
  }) {
    let createTeacher: Teacher;

    await this.dataSource.transaction(async (manager: EntityManager) => {
      createTeacher = manager.create(Teacher, {
        status: ETeacherStatus.ACTIVE,
        ...teacherData,
      });

      await manager.save(createTeacher);
    });

    return createTeacher;
  }

  /**
   * 강사 조회
   * @param id
   */
  async getTeacherById(id: number) {
    const findTeacher = await this.teacherRepository.findOne({
      where: {
        id: id,
      },
      relations: ['lectures'],
    });

    if (!findTeacher) {
      throw new NotFoundException(ETeacherErrorMessage.TEACHER_NOT_FOUND);
    }

    return findTeacher;
  }

  /**
   * 강사 복수 조회
   * @param query
   */
  async listTeacher(query) {
    const { offset, page, size, sortBy, ...data } = query;
    const where = {
      ...data,
    };

    const [list, total] = await this.teacherRepository.findAndCount({
      where: where,
      relations: ['lectures'],
      ...findPagination({ offset, page, size, sortBy }),
    });

    const pagination = responsePagination(total, list.length, query);

    return { list: list, pagination: pagination };
  }

  /**
   * 강사 수정
   * @param id
   * @param updateTeacherData
   */
  async updateTeacherById(
    id: number,
    updateTeacherData: {
      name?: string;
      status?: ETeacherStatus;
      description?: string;
      profileImageUrl?: string;
    },
  ): Promise<Teacher> {
    await this.getTeacherById(id);

    await this.teacherRepository.update(id, updateTeacherData);
    return this.getTeacherById(id);
  }

  /**
   * 강사 삭제
   * @param id
   */
  async deleteTeacherById(id: number) {
    const findTeacher = await this.getTeacherById(id);

    await this.teacherRepository.softDelete({
      id: id,
    });

    return findTeacher;
  }
}
