import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DOMAINS,
  ELectureContentErrorMessage,
  ELectureContentStatus,
  EVideoStatus,
  findPagination,
  InternalApiService,
  LectureContent,
  responsePagination,
  shortNumberId,
} from '@app/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class LectureContentService {
  constructor(
    @InjectDataSource(DOMAINS.Lecture)
    private dataSource: DataSource,
    @InjectRepository(LectureContent, DOMAINS.Lecture)
    private readonly lectureContentRepository: Repository<LectureContent>,
    private readonly internalApiService: InternalApiService,
  ) {}

  /**
   * 강의 컨텐츠 생성
   * @param lectureContentData
   */
  async createLectureContent(lectureContentData: {
    lectureId: number;
    videoId?: number;
    sequence: number;
    name: string;
    subName?: string;
    content?: string;
    time: string;
    page?: string;
  }): Promise<LectureContent> {
    let createLectureContent: LectureContent;

    await this.dataSource.transaction(async (manager: EntityManager) => {
      createLectureContent = manager.create(LectureContent, {
        ...lectureContentData,
        videoCode: shortNumberId(10),
        status: ELectureContentStatus.ACTIVE,
      });

      await manager.save(createLectureContent);
    });

    if (lectureContentData.videoId) {
      await this.internalApiService.put(
        `internal/videos/video-id/${lectureContentData.videoId}`,
        {
          status: EVideoStatus.ACTIVE,
        },
      );
    }

    return createLectureContent;
  }

  /**
   * 강의 복수 조회
   * @param query
   */
  async listLectureContent(query: any) {
    const { offset, page, size, sortBy, ...data } = query;
    const where = {
      ...data,
    };

    delete where.uploadStatus;

    const [list, total] = await this.lectureContentRepository.findAndCount({
      where: where,
      ...findPagination({ offset, page, size, sortBy }),
    });

    const pagination = responsePagination(total, list.length, query);

    const { data: videos } = await this.internalApiService.get(
      'internal/videos',
      {
        uploadStatus: query.uploadStatus,
        videoId: list.map((x) => x.videoId).join(','),
      },
    );

    const integratedList = list.map((lectureContent) => {
      return {
        ...lectureContent,
        video: videos.find(
          (video: { id: number }) => video.id == lectureContent.videoId,
        ),
      };
    });

    return { list: integratedList, pagination: pagination };
  }

  /**
   * 강의 컨텐츠 아이디 단일 조회
   * @param id
   */
  async getLectureContentById(id: number): Promise<LectureContent> {
    const findLectureContent: LectureContent =
      await this.lectureContentRepository.findOne({
        where: {
          id,
        },
      });

    if (!findLectureContent) {
      throw new NotFoundException(
        ELectureContentErrorMessage.LECTURE_CONTENT_NOT_FOUND,
      );
    }

    return findLectureContent;
  }

  /**
   * 강의 컨텐츠 아이디 삭제
   * @param id
   */
  async deleteLectureContentById(id: number): Promise<LectureContent> {
    const findLectureContent: LectureContent = await this.getLectureContentById(
      id,
    );

    /** 강의 컨텐츠 삭제 */
    await this.lectureContentRepository.softDelete({
      id,
    });

    return findLectureContent;
  }

  /**
   * 강의 컨텐츠 수정
   * @param id
   * @param updateLectureContentData
   */
  async updateLectureContent(
    id: number,
    updateLectureContentData: {
      lectureId?: number;
      videoId?: number;
      sequence?: number;
      name?: string;
      subName?: string;
      content?: string;
      time?: string;
      page?: string;
    },
  ): Promise<LectureContent> {
    const lectureContent = await this.lectureContentRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!lectureContent) {
      throw new BadRequestException(
        ELectureContentErrorMessage.LECTURE_CONTENT_NOT_FOUND,
      );
    }

    if (updateLectureContentData.videoId) {
      if (lectureContent.videoId) {
        await this.internalApiService.put(
          `internal/videos/video-id/${lectureContent.videoId}`,
          {
            status: EVideoStatus.INACTIVE,
          },
        );
      }

      await this.internalApiService.put(
        `internal/videos/video-id/${updateLectureContentData.videoId}`,
        {
          status: EVideoStatus.ACTIVE,
        },
      );
    }

    /** 강의 컨텐츠 수정 */
    await this.lectureContentRepository.update(id, updateLectureContentData);

    return this.getLectureContentById(id);
  }
}
