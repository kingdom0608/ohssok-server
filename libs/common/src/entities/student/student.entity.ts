import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DOMAINS } from '@app/common/constants/domain.constant';
import { DateColumn, EStudentGrade, OneToMany } from '@app/common';
import { StudentManagementCard } from '@app/common/entities/student/student-management-card';

@Entity({ database: DOMAINS.Student })
@Index(['userId'], { unique: false })
export class Student {
  @OneToMany(
    () => StudentManagementCard,
    (studentManagementCard) => studentManagementCard.student,
    {
      cascade: true,
    },
  )
  managementCards: StudentManagementCard[];

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({
    comment: '사용자 ID',
  })
  userId: number;

  @Column({
    comment: '학생 이름',
    type: 'varchar',
    length: 10,
  })
  name: string;

  @Column({ comment: '전화번호', type: 'varchar', length: 30 })
  phoneNumber: string;

  @Column({ comment: '학부모 전화번호', type: 'varchar', length: 30 })
  parentPhoneNumber: string;

  @DateColumn({ comment: '생년월일', type: 'date' })
  birthday: Date;

  @Column({
    comment: '학교 이름',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  schoolName?: string;

  @Column({
    comment: '학년',
    type: 'varchar',
    length: 10,
  })
  grade: EStudentGrade;

  @Column({ comment: '내신 평균 점수', type: 'int', nullable: true })
  internalExamAverageScore?: number;

  @Column({ comment: '모의고사 평균 등급', type: 'int', nullable: true })
  mockExamAverageScore?: number;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
