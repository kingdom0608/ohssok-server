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
@Index(['id', 'videoCode'], { unique: true })
@Index(['videoCode'], { unique: false })
export class LectureContent {
  @ManyToOne(() => Lecture, (lecture) => lecture.contents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  lecture: Lecture;

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: '강의 ID' })
  @RelationId((lectureContent: LectureContent) => lectureContent.lecture)
  lectureId: number;

  @Column({ comment: '상태', type: 'varchar', length: 30 })
  status: ELectureContentStatus;

  @Column({
    comment: '이름',
    type: 'varchar',
    length: 30,
  })
  name: string;

  @Column({
    comment: '상세 이름',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  subName?: string;

  @Column({
    comment: '내용',
    type: 'text',
    nullable: true,
  })
  content?: string;

  @Column({
    comment: '영상 아이디',
    type: 'int',
    nullable: true,
  })
  videoId?: number;

  @Column({
    comment: '영상 코드',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  videoCode?: string;

  @Column({
    comment: '시간',
    type: 'time',
  })
  time: string;

  @Column({
    comment: '페이지',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  page?: string;

  @Column({
    comment: '노출 순서',
    type: 'int',
  })
  sequence: number;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
