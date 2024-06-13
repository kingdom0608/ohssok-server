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
import {
  ENoticeCategory,
  ENoticeStatus,
} from '@app/common/enums/notice/notice.enum';

@Entity({ database: DOMAINS.Notice })
@Index(['title'], { unique: false })
export class Notice {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({
    comment: '제목',
    type: 'varchar',
    length: 30,
  })
  title: string;

  @Column({
    comment: '내용',
    type: 'longtext',
  })
  contents: string;

  @Column({
    comment: '카테고리',
    type: 'varchar',
    length: 30,
  })
  category: ENoticeCategory;

  @Column({
    comment: '상태',
    type: 'varchar',
    length: 30,
  })
  status: ENoticeStatus;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
