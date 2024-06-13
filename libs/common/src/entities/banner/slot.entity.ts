import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Banner, DOMAINS, OneToMany } from '@app/common';
import { ESlotStatus } from '@app/common/enums/banner';

@Entity({ database: DOMAINS.Display })
@Index(['title'], { unique: true })
export class Slot {
  @OneToMany(() => Banner, (banner) => banner.slot, {
    cascade: true,
  })
  banners: Banner[];

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({
    comment: '배너 슬롯 제목',
    type: 'varchar',
    length: 50,
  })
  title: string;

  @Column({ comment: '상태', type: 'varchar', length: 30 })
  status: ESlotStatus;

  @Column({
    comment: '작성자 User ID',
    type: 'int',
  })
  writerUserId: number;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
