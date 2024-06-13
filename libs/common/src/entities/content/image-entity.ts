import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DOMAINS, EImageStatus } from '@app/common';

@Entity({ database: DOMAINS.Content })
export class Image {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({
    comment: '파일 업로드 이름',
    type: 'varchar',
    length: 100,
  })
  fileName: string;

  @Column({
    comment: '파일 이름',
    type: 'varchar',
    length: 100,
  })
  originalFileName: string;

  @Column({
    comment: '파일 사이즈(Byte)',
    type: 'int',
  })
  fileSize: number;

  @Column({
    comment: '확장자',
    type: 'varchar',
    length: 100,
  })
  extension: string;

  @Column({
    comment: '파일 s3 key',
    type: 'varchar',
    length: 100,
  })
  key: string;

  @Column({
    comment: '파일 사용 대상',
    type: 'varchar',
    length: 100,
  })
  target: string;

  @Column({
    comment: '이미지 조회 Url',
    type: 'varchar',
    length: 300,
  })
  url: string;

  @Column({ comment: '상태', type: 'varchar', length: 30 })
  status: EImageStatus;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
