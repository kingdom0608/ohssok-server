import {
  DOMAINS,
  ELectureContentStatus,
  Lecture,
  ManyToOne,
} from '@app/common';
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

@Entity({ database: DOMAINS.Lecture })
@Index(['lectureId'], { unique: false })
export class LectureThumbnail {
  @ManyToOne(() => Lecture, (lecture) => lecture.thumbnails, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  lecture: Lecture;

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: '강의 ID' })
  @RelationId((lectureThumbnail: LectureThumbnail) => lectureThumbnail.lecture)
  lectureId: number;

  @Column({
    comment: '상태',
    type: 'varchar',
    length: 30,
    enum: ELectureContentStatus,
  })
  status: ELectureContentStatus = ELectureContentStatus.ACTIVE;

  @Column({
    comment: '노출 순서',
    type: 'int',
  })
  sequence: number;

  @Column({
    comment: '이미지 url',
    type: 'varchar',
    length: 500,
  })
  imageUrl: string;

  @Column({
    comment: '이미지 id',
    type: 'int',
  })
  imageId: number;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
