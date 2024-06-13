import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DOMAINS, EUserCertifyStatus } from '@app/common';

@Entity({ database: DOMAINS.User })
@Index(['phoneNumber'], { unique: false })
export class UserCertify {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: '코드', type: 'varchar', length: 10 })
  code: string;

  @Column({ comment: '전화번호', type: 'varchar', length: 30 })
  phoneNumber: string;

  @Column({ comment: '상태', type: 'varchar', length: 10 })
  status: EUserCertifyStatus;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
