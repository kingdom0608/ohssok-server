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
  EStudentManagementCardStatus,
  ManyToOne,
  OneToMany,
} from '@app/common';
import { Student } from '@app/common/entities/student/student.entity';
import { StudentManagementCardDetail } from '@app/common/entities/student/student-management-card-detail';

@Entity({ database: DOMAINS.Student })
@Index(['studentId'], { unique: false })
export class StudentManagementCard {
  @ManyToOne(() => Student, (student) => student.managementCards, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  student: Student;

  @OneToMany(
    () => StudentManagementCardDetail,
    (studentManagementCardDetail) =>
      studentManagementCardDetail.studentManagementCard,
    {
      cascade: true,
    },
  )
  details: StudentManagementCardDetail[];

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: '학생 ID' })
  @RelationId(
    (studentManagementCard: StudentManagementCard) =>
      studentManagementCard.student,
  )
  studentId: number;

  @Column({ comment: '강의 ID' })
  lectureId: number;

  @Column({
    comment: '강의명',
    type: 'varchar',
    length: 30,
  })
  lectureName: string;

  @Column({
    comment: '학생 관리 카드 코드',
    type: 'varchar',
    length: 15,
  })
  code: string;

  @Column({ comment: '상태', type: 'varchar', length: 10 })
  status: EStudentManagementCardStatus;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
