import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DOMAINS,
  EImageStatus,
  ELectureContentStatus,
  ELectureErrorMessage,
  ELectureLevel,
  ELectureStatus,
  EStudentGrade,
  findPagination,
  InternalApiService,
  Lecture,
  LectureContent,
  responsePagination,
  updateForDeleteAndUpdateAndCreate,
} from '@app/common';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { LectureThumbnail } from '@app/common/entities/lecture/lecture-thumbnail.entity';

@Injectable()
export class LectureService {
  constructor(
    @InjectDataSource(DOMAINS.Lecture)
    private dataSource: DataSource,
    @InjectRepository(Lecture, DOMAINS.Lecture)
    private readonly lectureRepository: Repository<Lecture>,
    @InjectRepository(LectureContent, DOMAINS.Lecture)
    private readonly lectureContentRepository: Repository<LectureContent>,
    private readonly internalApiService: InternalApiService,
  ) {}

  /**
   * 강의 생성
   * @param lectureData
   */
  async createLecture(lectureData: {
    teacherId: number;
    categoryId: number;
    textbookId: number;
    name: string;
    status?: ELectureStatus;
    level: ELectureLevel;
    learningStage: string;
    scope: string;
    feature: string;
    subjectGroup: EStudentGrade;
    subjectGroupDescription: string;
    price?: number;
    discountRate?: number;
    description: string;
    tags?: {
      name: string;
    }[];
    thumbnails?: {
      imageId: number;
      imageUrl: string;
      sequence: number;
    }[];
  }) {
    let createLecture: Lecture;

    await this.dataSource.transaction(async (manager: EntityManager) => {
      createLecture = manager.create(Lecture, {
        status: lectureData.status ? lectureData.status : ELectureStatus.ACTIVE,
        ...lectureData,
      });

      if (lectureData.thumbnails) {
        const imageIds = lectureData.thumbnails.map((it) => it.imageId);
        await this.internalApiService.put(
          `internal/images/image-ids/${imageIds.join(',')}`,
          {
            status: EImageStatus.ACTIVE,
          },
        );
      }

      await manager.save(createLecture);
    });

    return createLecture;
  }

  /**
   * 강의 복수 조회
   * @param query
   */
  async listLecture(query) {
    const { offset, page, size, sortBy, ...data } = query;
    const where = {
      ...data,
    };

    if (data.tagNames) {
      delete where.tagNames;
      where['tags'] = {
        name: In(data.tagNames.split(',')),
      };
    }

    if (data.categoryIds) {
      delete where.categoryIds;
      where['categoryId'] = In(data.categoryIds.split(','));
    }

    if (data.subjectGroups) {
      delete where.subjectGroups;
      where['subjectGroup'] = In(data.subjectGroups.split(','));
    }

    const [list, total] = await this.lectureRepository.findAndCount({
      where: where,
      relations: [
        'contents',
        'thumbnails',
        'tags',
        'teacher',
        'category',
        'category.upperCategory',
        'textbook',
      ],
      ...findPagination({ offset, page, size, sortBy }),
    });

    const pagination = responsePagination(total, list.length, query);

    return { list: list, pagination: pagination };
  }

  /**
   * 강의 아이디 조회
   * @param id
   */
  async getLectureById(id: number) {
    const findLecture = await this.lectureRepository.findOne({
      relations: [
        'contents',
        'thumbnails',
        'tags',
        'teacher',
        'category',
        'textbook',
        'thumbnails',
      ],
      where: {
        id: id,
      },
    });

    if (!findLecture) {
      throw new NotFoundException(ELectureErrorMessage.LECTURE_NOT_FOUND);
    }

    return findLecture;
  }

  /**
   * 액티브 강의 아이디 조회
   * @param id
   */
  async getActiveLectureById(id: number) {
    const findLecture = await this.lectureRepository.findOne({
      relations: [
        'contents',
        'thumbnails',
        'tags',
        'teacher',
        'category',
        'textbook',
      ],
      where: {
        id: id,
        status: ELectureStatus.ACTIVE,
      },
    });

    if (!findLecture) {
      throw new NotFoundException(ELectureErrorMessage.LECTURE_NOT_FOUND);
    }

    return findLecture;
  }

  /**
   * 강의 수정
   * @param id
   * @param updateLectureData
   */
  async updateLecture(
    id: number,
    updateLectureData: {
      teacherId?: number;
      textbookId?: number;
      name?: string;
      level?: ELectureLevel;
      learningStage?: string;
      scope?: string;
      feature?: string;
      subjectGroup?: EStudentGrade;
      subjectGroupDescription?: string;
      description?: string;
      thumbnails?: {
        id?: number;
        imageId: number;
        imageUrl: string;
        sequence: number;
      }[];
    },
  ): Promise<Lecture> {
    const lecture = await this.lectureRepository.findOne({
      where: {
        id: id,
      },
      relations: ['thumbnails'],
    });

    if (!lecture) {
      throw new BadRequestException(ELectureErrorMessage.LECTURE_NOT_FOUND);
    }

    await this.dataSource.transaction(async (manager: EntityManager) => {
      // 썸네일 추가/수정/삭제
      const { createData, updateData, deleteData } =
        updateForDeleteAndUpdateAndCreate(
          lecture.thumbnails,
          updateLectureData.thumbnails,
        );

      delete updateLectureData.thumbnails;

      await manager.upsert(
        LectureThumbnail,
        [...createData, ...updateData].map((it) => {
          return {
            ...it,
            status: ELectureContentStatus.ACTIVE,
            lectureId: lecture.id,
          };
        }),
        { conflictPaths: ['id'], upsertType: 'on-duplicate-key-update' },
      );

      const createImageIds = createData.map(
        (it: { imageId: number }) => it.imageId,
      );
      if (createImageIds.length > 0) {
        await this.internalApiService.put(
          `internal/images/image-ids/${createImageIds.join(',')}`,
          {
            status: EImageStatus.ACTIVE,
          },
        );
      }

      const deleteImageIds = deleteData.map(
        (it: LectureThumbnail) => it.id as number,
      );

      if (deleteImageIds.length > 0) {
        await this.internalApiService.put(
          `internal/images/image-ids/${deleteImageIds.join(',')}`,
          {
            status: EImageStatus.INACTIVE,
          },
        );
      }

      await manager.softDelete(LectureThumbnail, {
        id: In(deleteImageIds),
      });

      /** 강의 수정 */
      await manager.update(Lecture, id, updateLectureData);
    });

    return this.getLectureById(id);
  }

  /**
   * 강의 아이디 삭제
   * @param id
   */
  async deleteLectureById(id: number): Promise<Lecture> {
    const findLecture = await this.getLectureById(id);

    /** 강의 삭제 */
    await this.lectureRepository.softDelete({
      id: id,
    });

    /** 강의 컨텐츠 삭제 */
    await this.lectureContentRepository.softDelete({
      lectureId: id,
    });

    return findLecture;
  }
}
