import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DOMAINS, ETextbookStatus, Lecture, OneToMany } from '@app/common';

@Entity({ database: DOMAINS.Lecture })
export class Textbook {
  @OneToMany(() => Lecture, (lecture) => lecture.textbook, {
    cascade: true,
  })
  lectures: Lecture[];

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({
    comment: '이미지 ID',
    type: 'int',
  })
  imageId: number;

  @Column({
    comment: '이미지 URL',
    type: 'text',
  })
  imageUrl: string;

  @Column({
    comment: '이름',
    type: 'varchar',
    length: 30,
  })
  name: string;

  @Column({ comment: '상태', type: 'varchar', length: 30 })
  status: ETextbookStatus;

  @Column({
    comment: '저자',
    type: 'varchar',
    length: 30,
  })
  author: string;

  @Column({
    comment: '페이지',
    type: 'varchar',
    length: 30,
  })
  page: string;

  @Column({
    comment: '사이즈',
    type: 'varchar',
    length: 30,
  })
  size: string;

  @Column({ comment: '설명', type: 'text' })
  description: string;

  @Column({ comment: '출간 일자', type: 'datetime' })
  publishDate: Date;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
