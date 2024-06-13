import { DOMAINS, Lecture, ManyToOne } from '@app/common';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ database: DOMAINS.Lecture })
export class LectureTag {
  @ManyToOne(() => Lecture, (lecture) => lecture.contents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  lecture: Lecture;

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: '강의 ID' })
  @RelationId((lectureTag: LectureTag) => lectureTag.lecture)
  lectureId: number;

  @Column({
    comment: '이름',
    type: 'varchar',
    length: 30,
  })
  name: string;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
