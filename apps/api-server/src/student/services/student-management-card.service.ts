import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DOMAINS,
  EStudentErrorMessage,
  EStudentManagementCardErrorMessage,
  EStudentManagementCardStatus,
  findPagination,
  responsePagination,
  shortId,
  SmsNotification,
} from '@app/common';
import { Student, StudentManagementCard } from '@app/common/entities/student';
import {
  And,
  In,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import * as dateFns from 'date-fns';

@Injectable()
export class StudentManagementCardService {
  constructor(
    @InjectRepository(Student, DOMAINS.Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(StudentManagementCard, DOMAINS.Student)
    private readonly studentManagementCardRepository: Repository<StudentManagementCard>,
    private readonly smsNotification: SmsNotification,
  ) {}

  /**
   * 학생 관리 카드 생성
   * @param studentManagementCardData
   */
  async createStudentManagementCard(studentManagementCardData: {
    lectureId: number;
    lectureName: string;
    studentId: number;
  }) {
    const student = await this.studentRepository.findOne({
      where: { id: studentManagementCardData.studentId },
    });

    if (!student) {
      throw new NotFoundException(EStudentErrorMessage.STUDENT_NOT_FOUND);
    }

    const createStudentManagementCard =
      this.studentManagementCardRepository.create({
        ...studentManagementCardData,
        code: shortId(10),
        status: EStudentManagementCardStatus.ACTIVE,
      });

    return this.studentManagementCardRepository.save(
      createStudentManagementCard,
    );
  }

  /**
   * 학생 관리 카드 목록 조회
   * @param query
   */
  async listStudentManagementCard(query: {
    offset?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    userId?: number;
    status?: EStudentManagementCardStatus;
    name?: string;
    phoneNumber?: number;
    birth?: Date;
    grades?: string;
    createDateFrom?: Date;
    createDateTo?: Date;
    lectureId?: number;
    lectureName?: string;
  }) {
    const { offset, page, size, sortBy, ...data } = query;
    const where: any = {
      ...data,
      student: {},
    };

    if (where.userId) {
      where.student.userId = query.userId;
      delete where.userId;
    }

    if (where.name) {
      where.student.name = Like(`%${where.name}%`);
      delete where.name;
    }

    if (where.grades) {
      where.student.grade = In(where.grades.split(','));
      delete where.grades;
    }

    if (where.phoneNumber) {
      where.student.phoneNumber = Like(`%${where.phoneNumber}%`);
      delete where.phoneNumber;
    }

    if (where.createDateFrom) {
      const createDateFrom = dateFns.format(
        new Date(query.createDateFrom),
        "yyyy-MM-dd'T'00:00:00.SSSxxx",
      );

      where.createDate = MoreThanOrEqual(createDateFrom);
      delete where.createDateFrom;
    }

    if (where.createDateTo) {
      const createDateTo = dateFns.format(
        new Date(query.createDateTo),
        "yyyy-MM-dd'T'23:59:59.SSSxxx",
      );
      where.createDate = LessThanOrEqual(createDateTo);
      delete where.createDateTo;
    }

    if (where.createDateFrom || where.createDateTo) {
      const createDateFrom = query.createDateFrom
        ? MoreThanOrEqual(
            dateFns.format(
              new Date(query.createDateFrom),
              "yyyy-MM-dd'T'00:00:00.SSSxxx",
            ),
          )
        : null;

      const createDateTo = query.createDateTo
        ? LessThanOrEqual(
            dateFns.format(
              new Date(query.createDateTo),
              "yyyy-MM-dd'T'23:59:59.SSSxxx",
            ),
          )
        : null;

      where.createDate =
        createDateFrom && createDateTo
          ? And(createDateFrom, createDateTo)
          : createDateFrom || createDateTo;

      delete where.createDateFrom;
      delete where.createDateTo;
    }

    if (where.lectureName) {
      where.lectureName = Like(`%${where.lectureName}%`);
    }

    const [list, total] =
      await this.studentManagementCardRepository.findAndCount({
        where: where,
        relations: {
          student: true,
          details: {
            homeworks: true,
          },
        },
        ...findPagination({ offset, page, size, sortBy }),
      });

    const pagination = responsePagination(total, list.length, query);

    return { list: list, pagination: pagination };
  }

  /**
   * 학생 관리 카드 id 조회
   * @param id
   */
  async getStudentManagementCardById(
    id: number,
  ): Promise<StudentManagementCard> {
    const studentManagementCard =
      await this.studentManagementCardRepository.findOne({
        where: { id: id },
        relations: {
          student: true,
        },
      });

    if (!studentManagementCard) {
      throw new NotFoundException(
        EStudentManagementCardErrorMessage.STUDENT_MANAGEMENT_CARD_NOT_FOUND,
      );
    }

    return studentManagementCard;
  }

  /**
   * 학생 관리 카드 id userId 조회
   * @param id
   * @param userId
   */
  async getStudentManagementCardByIdUserId(
    id: number,
    userId: number,
  ): Promise<StudentManagementCard> {
    const studentManagementCard =
      await this.studentManagementCardRepository.findOne({
        where: {
          id: id,
          student: {
            userId: userId,
          },
        },
        relations: {
          student: true,
        },
      });

    if (!studentManagementCard) {
      throw new NotFoundException(
        EStudentManagementCardErrorMessage.STUDENT_MANAGEMENT_CARD_NOT_FOUND,
      );
    }

    return studentManagementCard;
  }

  /**
   * 학생 관리 카드 업데이트
   * @param id
   * @param studentManagementCardData
   */
  async updateStudentManagementCard(
    id: number,
    studentManagementCardData: {
      status?: EStudentManagementCardStatus;
      lectureId?: number;
      lectureName?: string;
    },
  ) {
    await this.getStudentManagementCardById(id);

    await this.studentManagementCardRepository.update(
      id,
      studentManagementCardData,
    );

    return this.getStudentManagementCardById(id);
  }

  /**
   * 학생 관리 카드 삭제
   * @param id
   */
  async deleteStudentManagementCardById(id: number) {
    const studentManagementCard = await this.getStudentManagementCardById(id);

    await this.studentManagementCardRepository.softDelete({
      id: id,
    });
    return studentManagementCard;
  }

  /**
   * 학생 관리 카드 전송
   * @param id
   */
  async sendStudentManagementCardByIdForParent(id: number) {
    const studentManagementCard = await this.getStudentManagementCardById(id);

    if (studentManagementCard.student.parentPhoneNumber) {
      /** 인증 번호 발송 */
      await this.smsNotification.smsSend(
        studentManagementCard.student.parentPhoneNumber,
        `[ohssok] ${studentManagementCard.student.name} 학생의 카드가 업데이트 되었습니다.`,
      );
    } else {
      throw new NotFoundException(EStudentErrorMessage.STUDENT_NOT_FOUND);
    }

    return true;
  }
}
