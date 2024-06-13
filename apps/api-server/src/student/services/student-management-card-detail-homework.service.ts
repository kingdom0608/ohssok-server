import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  StudentManagementCardDetail,
  StudentManagementCardDetailHomework,
} from '@app/common/entities/student';
import {
  DOMAINS,
  EStudentManagementCardDetailErrorMessage,
  EStudentManagementCardDetailHomeworkErrorMessage,
} from '@app/common';
import { Repository } from 'typeorm';
import { EStudentManagementCardDetailHomeworkCheck } from '@app/common/enums/student/student-management-card-detail-homework.enum';

@Injectable()
export class StudentManagementCardDetailHomeworkService {
  constructor(
    @InjectRepository(StudentManagementCardDetail, DOMAINS.Student)
    private readonly studentManagementCardDetailRepository: Repository<StudentManagementCardDetail>,
    @InjectRepository(StudentManagementCardDetailHomework, DOMAINS.Student)
    private readonly studentManagementCardDetailHomeworkRepository: Repository<StudentManagementCardDetailHomework>,
  ) {}

  /**
   * 학생 관리 카드 숙제 조회
   * @param id
   */
  async getStudentManagementCardDetailHomeworkById(id: number) {
    const homework =
      await this.studentManagementCardDetailHomeworkRepository.findOne({
        where: { id: id },
      });

    if (!homework) {
      throw new NotFoundException(
        EStudentManagementCardDetailHomeworkErrorMessage.STUDENT_MANAGEMENT_CARD_DETAIL_HOMEWORK_NOT_FOUND,
      );
    }
    return homework;
  }

  /**
   * 학생 관리 카드 숙제 생성
   * @param homeworkData
   */
  async createStudentManagementCardDetailHomework(homeworkData: {
    studentManagementCardDetailId: number;
    homeworkName: string;
    homeworkCheck?: EStudentManagementCardDetailHomeworkCheck;
  }) {
    const cardDetail = await this.studentManagementCardDetailRepository.findOne(
      {
        where: { id: homeworkData.studentManagementCardDetailId },
      },
    );

    if (!cardDetail) {
      throw new NotFoundException(
        EStudentManagementCardDetailErrorMessage.STUDENT_MANAGEMENT_CARD_DETAIL_NOT_FOUND,
      );
    }

    const createHomework =
      await this.studentManagementCardDetailHomeworkRepository.create({
        ...homeworkData,
      });
    await this.studentManagementCardDetailHomeworkRepository.save(
      createHomework,
    );
    return createHomework;
  }

  /**
   * 학생 관리 카드 숙제 수정
   * @param id
   * @param studentManagementCardDetailHomeworkData
   */
  async updateStudentManagementCardDetailHomework(
    id: number,
    studentManagementCardDetailHomeworkData: {
      homeworkName?: string;
      homeworkCheck?: EStudentManagementCardDetailHomeworkCheck;
    },
  ) {
    await this.getStudentManagementCardDetailHomeworkById(id);

    await this.studentManagementCardDetailHomeworkRepository.update(
      id,
      studentManagementCardDetailHomeworkData,
    );
    return this.getStudentManagementCardDetailHomeworkById(id);
  }

  /**
   * 학생 관리 카드 숙제  삭제
   * @param id
   */
  async deleteStudentManagementCardDetailById(id: number) {
    const homework = await this.getStudentManagementCardDetailHomeworkById(id);

    await this.studentManagementCardDetailHomeworkRepository.delete({
      id: id,
    });
    return homework;
  }
}
