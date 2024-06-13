import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { EStudentManagementCardDetailTestPassStatus } from '@app/common/enums/student/student-management-card-detail.enum';
import {
  StudentManagementCard,
  StudentManagementCardDetail,
  StudentManagementCardDetailHomework,
} from '@app/common/entities/student';
import {
  DOMAINS,
  EStudentErrorMessage,
  EStudentManagementCardDetailErrorMessage,
  EStudentManagementCardDetailHomeworkCheck,
  EStudentManagementCardDetailStatus,
  EStudentManagementCardErrorMessage,
  findPagination,
  isProduction,
  responsePagination,
  SmsNotification,
} from '@app/common';
import { DataSource, EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class StudentManagementCardDetailService {
  constructor(
    @InjectDataSource(DOMAINS.Student)
    private dataSource: DataSource,
    @InjectRepository(StudentManagementCardDetail, DOMAINS.Student)
    private readonly studentManagementCardDetailRepository: Repository<StudentManagementCardDetail>,
    private readonly smsNotification: SmsNotification,
  ) {}

  /**
   * 학생 관리 카드 상세 생성
   * @param studentManagementCardDetailData
   */
  async createStudentManagementCardDetail(studentManagementCardDetailData: {
    studentManagementCardId: number;
    week: string;
    vocabularyTestPassStatus?: EStudentManagementCardDetailTestPassStatus;
    vocabularyTestScore?: string;
    blankTestPassStatus?: EStudentManagementCardDetailTestPassStatus;
    blankTestScore?: string;
    note?: string;
    feedback?: string;
    homeworks?: {
      homeworkName: string;
      homeworkCheck?: EStudentManagementCardDetailHomeworkCheck;
    }[];
  }) {
    let createStudentManagementCardDetail: StudentManagementCardDetail;

    await this.dataSource.transaction(async (manager: EntityManager) => {
      /** 이미 존재 하는 주차의 학생 관리 카드 상세 인지 체크 */
      const findStudentManagementCardDetail = await manager.findOne(
        StudentManagementCardDetail,
        {
          where: {
            studentManagementCardId:
              studentManagementCardDetailData.studentManagementCardId,
            week: studentManagementCardDetailData.week,
          },
        },
      );

      if (findStudentManagementCardDetail) {
        throw new ConflictException(
          EStudentManagementCardDetailErrorMessage.STUDENT_MANAGEMENT_CARD_DETAIL_CONFLICT_WEEK,
        );
      }

      const studentManagementCard = await manager.findOne(
        StudentManagementCard,
        {
          where: {
            id: studentManagementCardDetailData.studentManagementCardId,
          },
        },
      );

      if (!studentManagementCard) {
        throw new NotFoundException(
          EStudentManagementCardErrorMessage.STUDENT_MANAGEMENT_CARD_NOT_FOUND,
        );
      }

      /** 카드 생성 */
      createStudentManagementCardDetail = manager.create(
        StudentManagementCardDetail,
        {
          ...studentManagementCardDetailData,
          status: EStudentManagementCardDetailStatus.ACTIVE,
        },
      );

      await manager.save(createStudentManagementCardDetail);
    });

    return createStudentManagementCardDetail;
  }

  /**
   * 학생 관리 카드 상세 목록 조회
   */
  async listStudentManagementCardDetail(query: {
    offset?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    status?: EStudentManagementCardDetailStatus;
    week?: string;
    studentManagementCardId?: number;
  }) {
    const { offset, page, size, sortBy, ...data } = query;
    const where: any = {
      ...data,
      studentManagementCard: {},
    };

    if (query.status) {
      where.status = query.status;
    }

    if (query.week) {
      where.week = query.week;
    }

    if (query.studentManagementCardId) {
      where.studentManagementCardId = query.studentManagementCardId;
    }

    const [list, total] =
      await this.studentManagementCardDetailRepository.findAndCount({
        where: where,
        relations: {
          homeworks: true,
        },
        ...findPagination({ offset, page, size, sortBy }),
      });

    const pagination = responsePagination(total, list.length, query);

    return { list: list, pagination: pagination };
  }

  /**
   * 학생 관리 카드 상세 id 조회
   * @param id
   */
  async getStudentManagementCardDetailById(id: number) {
    const student = await this.studentManagementCardDetailRepository.findOne({
      where: { id: id },
      relations: [
        'homeworks',
        'studentManagementCard',
        'studentManagementCard.student',
      ],
    });

    if (!student) {
      throw new NotFoundException(
        EStudentManagementCardDetailErrorMessage.STUDENT_MANAGEMENT_CARD_DETAIL_NOT_FOUND,
      );
    }

    return student;
  }

  /**
   * 학생 관리 카드 상세 id userId 조회
   * @param id
   * @param userId
   */
  async getStudentManagementCardDetailByIdUserId(id: number, userId: number) {
    const student = await this.studentManagementCardDetailRepository.findOne({
      where: {
        id: id,
        studentManagementCard: {
          student: {
            userId: userId,
          },
        },
      },
      relations: [
        'homeworks',
        'studentManagementCard',
        'studentManagementCard.student',
      ],
    });

    if (!student) {
      throw new NotFoundException(
        EStudentManagementCardDetailErrorMessage.STUDENT_MANAGEMENT_CARD_DETAIL_NOT_FOUND,
      );
    }

    return student;
  }

  /**
   * 학생 관리 카드 상세 code-week 조회
   * @param codeWeek
   */
  async getStudentManagementCardDetailByCodeWeek(
    codeWeek: string,
  ): Promise<StudentManagementCardDetail> {
    const splitCodeWeek = codeWeek.split('-');

    if (splitCodeWeek.length !== 2) {
      throw new BadRequestException(
        EStudentManagementCardDetailErrorMessage.STUDENT_MANAGEMENT_CARD_DETAIL_NOT_FOUND,
      );
    }

    const studentManagementCardDetail =
      await this.studentManagementCardDetailRepository.findOne({
        where: {
          week: splitCodeWeek[1],
          studentManagementCard: {
            code: splitCodeWeek[0],
          },
        },
        relations: [
          'homeworks',
          'studentManagementCard',
          'studentManagementCard.student',
        ],
      });

    if (!studentManagementCardDetail) {
      throw new NotFoundException(
        EStudentManagementCardDetailErrorMessage.STUDENT_MANAGEMENT_CARD_DETAIL_NOT_FOUND,
      );
    }

    return studentManagementCardDetail;
  }

  /**
   * 학생 관리 카드 수정
   * @param id
   * @param studentManagementCardDetailData
   */
  async updateStudentManagementCardDetail(
    id: number,
    studentManagementCardDetailData: {
      status?: EStudentManagementCardDetailStatus;
      week?: string;
      vocabularyTestScore?: string;
      vocabularyTestPassStatus?: EStudentManagementCardDetailTestPassStatus;
      blankTestScore?: string;
      blankTestPassStatus?: EStudentManagementCardDetailTestPassStatus;
      note?: string;
      feedback?: string;
      homeworks?: {
        id?: number;
        homeworkName: string;
        homeworkCheck?: EStudentManagementCardDetailHomeworkCheck;
      }[];
    },
  ) {
    const studentCardDetail = await this.getStudentManagementCardDetailById(id);
    await this.dataSource.transaction(async (manager: EntityManager) => {
      // 숙제 업데이트
      if (studentManagementCardDetailData.homeworks) {
        // 배열에 없는 경우 삭제
        const updateHomeworkIds = studentManagementCardDetailData.homeworks.map(
          (homework) => homework.id,
        );
        const homeworkIdsToDelete = studentCardDetail.homeworks
          .filter((homework) => !updateHomeworkIds.includes(homework.id))
          .map((homework) => homework.id);

        await manager.softDelete(StudentManagementCardDetailHomework, {
          id: In(homeworkIdsToDelete),
        });
        // ID 가 있으면 수정, 없으면 생성
        await manager.upsert(
          StudentManagementCardDetailHomework,
          studentManagementCardDetailData.homeworks.map((x) => {
            return {
              ...x,
              studentManagementCardDetailId: studentCardDetail.id,
            };
          }),
          {
            conflictPaths: ['id'],
          },
        );

        delete studentManagementCardDetailData.homeworks;
      }

      await manager.update(
        StudentManagementCardDetail,
        id,
        studentManagementCardDetailData,
      );
    });

    return this.getStudentManagementCardDetailById(id);
  }

  /**
   * 학생 관리 카드 삭제
   * @param id
   */
  async deleteStudentManagementCardDetailById(id: number) {
    const studentManagementCardDetail =
      await this.getStudentManagementCardDetailById(id);

    await this.studentManagementCardDetailRepository.softDelete({
      id: id,
    });

    return studentManagementCardDetail;
  }

  /**
   * 학생 관리 카드 상세 전송
   * @param id
   */
  async sendStudentManagementCardDetailForParent(id: number) {
    const studentManagementCardDetail =
      await this.getStudentManagementCardDetailById(id);

    /** 학생 관리 카드 상세가 활성화 상태가 아니면 전송 되지 않음 */
    if (
      studentManagementCardDetail.status !==
      EStudentManagementCardDetailStatus.ACTIVE
    ) {
      throw new BadRequestException(
        EStudentManagementCardDetailErrorMessage.STUDENT_MANAGEMENT_CARD_DETAIL_INVALID_SEND_MESSAGE,
      );
    }

    if (
      studentManagementCardDetail.studentManagementCard.student
        .parentPhoneNumber
    ) {
      const domainUrl = isProduction()
        ? 'https://ohssok.com'
        : 'https://dev.ohssok.com';

      /** 인증 번호 발송 */
      await this.smsNotification.smsSend(
        studentManagementCardDetail.studentManagementCard.student
          .parentPhoneNumber,
        `[ohssok] ${studentManagementCardDetail.studentManagementCard.student.name} 학생의 ${studentManagementCardDetail.week} 주차 학습 내용이 추가 되었습니다. \n
        ${domainUrl}/management/card/${studentManagementCardDetail.studentManagementCard.code}-${studentManagementCardDetail.week}
        `,
      );
    } else {
      throw new NotFoundException(EStudentErrorMessage.STUDENT_NOT_FOUND);
    }

    return true;
  }
}
