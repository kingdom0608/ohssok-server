import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DOMAINS, EVideoStatus, EVideoUploadStatus } from '@app/common';

@Entity({ database: DOMAINS.Content })
@Index(['code'], { unique: false })
export class Video {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({
    comment: '코드',
    type: 'varchar',
    length: 10,
  })
  code: string;

  @Column({
    comment: '파일 이름',
    type: 'varchar',
    length: 100,
  })
  fileName: string;

  @Column({
    comment: '파일 사이즈(Byte)',
    type: 'int',
  })
  fileSize: number;

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
    comment: '업로드 id',
    type: 'varchar',
    nullable: true,
    length: 1000,
  })
  uploadId?: string;

  @Column({ comment: '상태', type: 'varchar', length: 30 })
  status: EVideoStatus;

  @Column({ comment: '업로드 상태', type: 'varchar', length: 30 })
  uploadStatus: EVideoUploadStatus;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
