import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import {
  DOMAINS,
  EStudentManagementCardDetailStatus,
  ManyToOne,
  OneToMany,
} from '@app/common';
import { StudentManagementCard } from '@app/common/entities/student/student-management-card';
import { StudentManagementCardDetailHomework } from '@app/common/entities/student/student-management-card-detail-homework';
import { EStudentManagementCardDetailTestPassStatus } from '@app/common/enums/student/student-management-card-detail.enum';

@Entity({ database: DOMAINS.Student })
@Index(['studentManagementCardId'], { unique: false })
@Index(['status', 'week'], { unique: false })
export class StudentManagementCardDetail {
  @ManyToOne(
    () => StudentManagementCard,
    (studentManagementCard) => studentManagementCard.details,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  studentManagementCard: StudentManagementCard;

  @OneToMany(
    () => StudentManagementCardDetailHomework,
    (studentManagementCardDetailHomework) =>
      studentManagementCardDetailHomework.studentManagementCardDetail,
    {
      cascade: true,
    },
  )
  homeworks: StudentManagementCardDetailHomework[];

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: '학생 관리 카드 ID' })
  @RelationId(
    (studentManagementCardDetail: StudentManagementCardDetail) =>
      studentManagementCardDetail.studentManagementCard,
  )
  studentManagementCardId: number;

  @Column({ comment: '상태', type: 'varchar', length: 10 })
  status: EStudentManagementCardDetailStatus;

  @Column({
    comment: '주차',
    type: 'varchar',
    length: 10,
  })
  week: string;

  @Column({
    comment: '어휘 테스트 통과 상태',
    type: 'varchar',
    length: 30,
    nullable: true,
    default: EStudentManagementCardDetailTestPassStatus.NONE,
  })
  vocabularyTestPassStatus?: EStudentManagementCardDetailTestPassStatus;

  @Column({
    comment: '어휘 테스트 점수',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  vocabularyTestScore?: string;

  @Column({
    comment: '백지 테스트 통과 상태',
    type: 'varchar',
    length: 30,
    nullable: true,
    default: EStudentManagementCardDetailTestPassStatus.NONE,
  })
  blankTestPassStatus?: EStudentManagementCardDetailTestPassStatus;

  @Column({
    comment: '백지 테스트 점수',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  blankTestScore?: string;

  @Column({
    comment: '비고',
    type: 'text',
    nullable: true,
  })
  note?: string;

  @Column({
    comment: '피드백',
    type: 'text',
    nullable: true,
  })
  feedback?: string;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
