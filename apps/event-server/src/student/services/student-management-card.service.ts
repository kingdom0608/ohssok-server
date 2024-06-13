import { Injectable } from '@nestjs/common';
import { DOMAINS, ESlackChannel, SlackService } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student, StudentManagementCard } from '@app/common/entities/student';
import { Repository } from 'typeorm';

@Injectable()
export class StudentManagementCardService {
  constructor(
    private readonly slackService: SlackService,
    @InjectRepository(Student, DOMAINS.Student)
    private readonly studentManagementCardRepository: Repository<StudentManagementCard>,
  ) {}

  /**
   * 학생 관리 카드 업데이트
   * @param data
   */
  async updateStudentManagementCard(data: {
    lecture: {
      id: number;
      name: string;
    };
  }) {
    try {
      const { lecture } = data;

      await this.studentManagementCardRepository.update(
        {
          lectureId: lecture.id,
        },
        {
          lectureName: lecture.name,
        },
      );

      return;
    } catch (err) {
      await this.slackService.sendSlackMessage(ESlackChannel.EVENTSERVER, {
        text: 'updateStudentManagement 이벤트 실패',
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
