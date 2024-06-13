import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '@app/common/entities/student';
import {
  DOMAINS,
  ESlackChannel,
  EStudentErrorMessage,
  EStudentGrade,
  SlackService,
} from '@app/common';
import { Repository } from 'typeorm';

@Injectable()
export class StudentService {
  constructor(
    private readonly slackService: SlackService,
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
    };
    student: {
      parentPhoneNumber: string;
      schoolName?: string;
      grade: EStudentGrade;
      internalExamAverageScore: number;
      mockExamAverageScore: number;
    };
  }) {
    try {
      const { user, student } = data;
      const createStudent = await this.studentRepository.create({
        userId: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        parentPhoneNumber: student.parentPhoneNumber,
        schoolName: student.schoolName || null,
        grade: student.grade,
        internalExamAverageScore: student.internalExamAverageScore,
        mockExamAverageScore: student.mockExamAverageScore,
      });

      await this.studentRepository.save(createStudent);

      return createStudent;
    } catch (err) {
      await this.slackService.sendSlackMessage(ESlackChannel.EVENTSERVER, {
        text: 'createStudent 이벤트 실패',
        attachments: [
          {
            color: '#FF0000',
            mrkdwn_in: ['text', 'fields'],
            fields: [
              {
                title: 'body',
                value: `\`\`\`${JSON.stringify(data, null, 2)}\`\`\``,
                short: false,
              },
              {
                title: 'error message',
                value: `\`\`\`${JSON.stringify(err.message, null, 2)}\`\`\``,
                short: false,
              },
            ],
          },
        ],
      });

      throw err;
    }
  }

  /**
   * 학생 아이디 업데이트
   * @param data
   */
  async updateStudent(data: {
    user: {
      id: number;
      name: string;
    };
  }) {
    try {
      const { user } = data;
      const student = await this.studentRepository.findOne({
        where: { id: user.id },
      });

      if (!student) {
        throw new NotFoundException(EStudentErrorMessage.STUDENT_NOT_FOUND);
      }

      await this.studentRepository.update(
        {
          id: user.id,
        },
        {
          name: user.name,
        },
      );

      return this.studentRepository.findOne({
        where: { id: user.id },
      });
    } catch (err) {
      await this.slackService.sendSlackMessage(ESlackChannel.EVENTSERVER, {
        text: 'updateStudent 이벤트 실패',
        attachments: [
          {
            color: '#FF0000',
            mrkdwn_in: ['text', 'fields'],
            fields: [
              {
                title: 'body',
                value: `\`\`\`${JSON.stringify(data, null, 2)}\`\`\``,
                short: false,
              },
              {
                title: 'error message',
                value: `\`\`\`${JSON.stringify(err.message, null, 2)}\`\`\``,
                short: false,
              },
            ],
          },
        ],
      });

      throw err;
    }
  }
}
