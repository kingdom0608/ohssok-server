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
import { DOMAINS, ManyToOne } from '@app/common';
import { StudentManagementCardDetail } from '@app/common/entities/student/student-management-card-detail';
import { EStudentManagementCardDetailHomeworkCheck } from '@app/common/enums/student/student-management-card-detail-homework.enum';

@Entity({ database: DOMAINS.Student })
@Index(['studentManagementCardDetailId'], { unique: false })
export class StudentManagementCardDetailHomework {
  @ManyToOne(
    () => StudentManagementCardDetail,
    (studentManagementCardDetail) => studentManagementCardDetail.homeworks,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  studentManagementCardDetail: StudentManagementCardDetail;

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: '학생 관리 카드 디테일 ID' })
  @RelationId(
    (
      studentManagementCardDetailHomework: StudentManagementCardDetailHomework,
    ) => studentManagementCardDetailHomework.studentManagementCardDetail,
  )
  studentManagementCardDetailId: number;

  @Column({
    comment: '숙제 이름',
    type: 'varchar',
    length: 50,
  })
  homeworkName: string;

  @Column({
    comment: '숙제 검사',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  homeworkCheck?: EStudentManagementCardDetailHomeworkCheck;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
