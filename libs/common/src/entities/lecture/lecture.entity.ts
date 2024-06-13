import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import {
  Category,
  DOMAINS,
  ELectureLevel,
  ELectureStatus,
  EStudentGrade,
  LectureTag,
  ManyToOne,
  OneToMany,
  Teacher,
} from '@app/common';
import { LectureContent } from '@app/common/entities/lecture/lecture-content.entity';
import { Textbook } from '@app/common/entities/lecture/textbook.entity';
import { LectureThumbnail } from '@app/common/entities/lecture/lecture-thumbnail.entity';

@Entity({ database: DOMAINS.Lecture })
export class Lecture {
  @ManyToOne(() => Teacher, (teacher) => teacher.lectures, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  teacher: Teacher;

  @ManyToOne(() => Category, (category) => category.lectures, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  category: Category;

  @ManyToOne(() => Textbook, (textbook) => textbook.lectures, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  textbook: Textbook;

  @OneToMany(() => LectureContent, (lectureContent) => lectureContent.lecture, {
    cascade: true,
  })
  contents: LectureContent[];

  @OneToMany(
    () => LectureThumbnail,
    (lectureThumbnail) => lectureThumbnail.lecture,
    {
      cascade: true,
    },
  )
  thumbnails: LectureThumbnail[];

  @OneToMany(() => LectureTag, (lectureTag) => lectureTag.lecture, {
    cascade: true,
  })
  tags: LectureTag[];

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: '강사 ID' })
  @RelationId((lecture: Lecture) => lecture.teacher)
  teacherId: number;

  @RelationId((lecture: Lecture) => lecture.category)
  @Column({ comment: '카테고리 ID' })
  categoryId: number;

  @RelationId((lecture: Lecture) => lecture.textbook)
  @Column({ comment: '교재 ID' })
  textbookId: number;

  @Column({
    comment: '이름',
    type: 'varchar',
    length: 50,
  })
  name: string;

  @Column({ comment: '상태', type: 'varchar', length: 30 })
  status: ELectureStatus;

  @Column({
    comment: '난이도',
    type: 'varchar',
    length: 10,
  })
  level: ELectureLevel;

  @Column({
    comment: '학습 단계',
    type: 'varchar',
    length: 30,
  })
  learningStage: string;

  @Column({
    comment: '범위',
    type: 'varchar',
    length: 50,
  })
  scope: string;

  @Column({ comment: '특징', type: 'text' })
  feature: string;

  @Column({ comment: '수강 대상', type: 'varchar', length: 50 })
  subjectGroup: EStudentGrade;

  @Column({ comment: '수강 대상 설명 ', type: 'text' })
  subjectGroupDescription: string;

  @Column({ comment: '가격', type: 'double', nullable: true })
  price?: number;

  @Column({
    comment: '할인율',
    type: 'double',
    nullable: true,
  })
  discountRate?: number;

  @Column({ comment: '설명', type: 'text' })
  description: string;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
