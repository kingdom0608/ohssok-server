import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '@app/common/entities/student';
import {
  DOMAINS,
  EStudentErrorMessage,
  EStudentGrade,
  findPagination,
  responsePagination,
} from '@app/common';
import { Like, Repository } from 'typeorm';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student, DOMAINS.Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  /**
   * 학생 생성
   * @param data
   */
  async createStudent(data: {
    user: {
      id: number;
      name: string;
      phoneNumber: string;
      birthday: Date;
    };
    student: {
      parentPhoneNumber: string;
      schoolName?: string;
      grade: EStudentGrade;
      internalExamAverageScore?: number;
      mockExamAverageScore?: number;
    };
  }) {
    const { user, student } = data;
    const createStudent = await this.studentRepository.create({
      userId: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      parentPhoneNumber: student.parentPhoneNumber,
      birthday: user.birthday,
      schoolName: student.schoolName || null,
      grade: student.grade,
      internalExamAverageScore: student.internalExamAverageScore,
      mockExamAverageScore: student.mockExamAverageScore,
    });

    await this.studentRepository.save(createStudent);

    return createStudent;
  }

  /**
   * 학생 아이디 수정
   * @param id
   * @param studentData
   */
  async updateStudentById(
    id: number,
    studentData: {
      parentPhoneNumber?: string;
      schoolName?: string;
      grade?: EStudentGrade;
      internalExamAverageScore?: number;
      mockExamAverageScore?: number;
    },
  ) {
    const student = await this.studentRepository.findOne({
      where: { id: id },
    });

    if (!student) {
      throw new NotFoundException(EStudentErrorMessage.STUDENT_NOT_FOUND);
    }

    await this.studentRepository.update(
      {
        id: id,
      },
      {
        ...studentData,
      },
    );

    return this.studentRepository.findOne({
      where: { id: id },
    });
  }

  /**
   * 유저 아이디 수정
   * @param userId
   * @param data
   */
  async updateStudentByUserId(
    userId: number,
    data: {
      user: {
        name?: string;
        phoneNumber?: string;
        birthday?: Date;
      };
    },
  ) {
    const { user } = data;
    const student = await this.studentRepository.findOne({
      where: { userId: userId },
    });

    if (!student) {
      throw new NotFoundException(EStudentErrorMessage.STUDENT_NOT_FOUND);
    }

    await this.studentRepository.update(
      {
        id: student.id,
      },
      {
        ...user,
      },
    );

    return this.studentRepository.findOne({
      where: { id: student.id },
    });
  }

  /**
   * 학생 목록 조회
   * @param query
   */
  async listStudent(query) {
    const { offset, page, size, sortBy, ...data } = query;
    const where = {
      ...data,
    };

    if (data.name) {
      where.name = Like(`%${data.name}%`);
    }

    const [list, total] = await this.studentRepository.findAndCount({
      where: where,
      ...findPagination({ offset, page, size, sortBy }),
    });

    const pagination = responsePagination(total, list.length, query);

    return { list: list, pagination: pagination };
  }

  /**
   * 학생 단일 조회
   * @param id
   */
  async getStudentById(id: number) {
    const student = await this.studentRepository.findOne({
      where: { id: id },
      relations: {
        managementCards: true,
      },
    });

    if (!student) {
      throw new NotFoundException(EStudentErrorMessage.STUDENT_NOT_FOUND);
    }
    return student;
  }
}
