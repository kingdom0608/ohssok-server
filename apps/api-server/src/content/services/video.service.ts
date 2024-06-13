import {
  DOMAINS,
  EVideoErrorMessageEnum,
  EVideoStatus,
  EVideoUploadStatus,
  findPagination,
  responsePagination,
  shortNumberId,
  Video,
} from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video, DOMAINS.Content)
    private readonly videoRepository: Repository<Video>,
  ) {}

  /**
   * 영상 업로드
   * @param videoData
   */
  async createVideo(videoData: {
    fileName: string;
    fileSize: number;
    target: string;
  }) {
    const code = shortNumberId(10);
    const video = this.videoRepository.create({
      ...videoData,
      status: EVideoStatus.INACTIVE,
      uploadStatus: EVideoUploadStatus.NONE,
      code: code,
      key: `videos/${code}/index.mp4`,
    });

    return this.videoRepository.save(video);
  }

  /**
   * 영상 조회
   * @param id
   */
  async getVideoById(id: number): Promise<Video> {
    const video = await this.videoRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!video) {
      throw new NotFoundException(EVideoErrorMessageEnum.VIDEO_NOT_FOUND);
    }

    return video;
  }

  /**
   * 업로드 완료된 영상 조회
   * @param id
   */
  async getCompletedVideoById(id: number): Promise<Video> {
    const video = await this.videoRepository.findOne({
      where: {
        id: id,
        uploadStatus: EVideoUploadStatus.COMPLETED,
      },
    });
    if (!video) {
      throw new BadRequestException(EVideoErrorMessageEnum.VIDEO_NOT_FOUND);
    }

    return video;
  }

  /**
   * 영상 목록 조회
   * @param query
   */
  async listVideo(query) {
    const { offset, page, size, sortBy, ...data } = query;
    const where = {
      ...data,
    };

    delete where.videoId;

    if (data.videoId) {
      where.id = In(data.videoId.split(','));
    }

    if (data.status) {
      where.status = In(data.status.split(','));
    }

    const [list, total] = await this.videoRepository.findAndCount({
      where: where,
      ...findPagination({ offset, page, size, sortBy }),
    });

    const pagination = responsePagination(total, list.length, query);

    return { list: list, pagination: pagination };
  }

  /**
   * 영상 수정
   * @param id
   * @param updateVideoData
   */
  async updateVideoById(
    id: number,
    updateVideoData: {
      status?: EVideoStatus;
      uploadStatus?: EVideoUploadStatus;
      uploadId?: string;
    },
  ) {
    await this.getVideoById(id);

    await this.videoRepository.update(id, updateVideoData);

    return this.getVideoById(id);
  }
}
