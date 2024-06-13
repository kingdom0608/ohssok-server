import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { DOMAINS, ManyToOne, Slot } from '@app/common';
import { EBannerPlatform, EBannerStatus } from '@app/common/enums/banner';

@Entity({ database: DOMAINS.Display })
@Index(['slotId'], { unique: false })
export class Banner {
  @ManyToOne(() => Slot, (slot) => slot.banners)
  @JoinColumn({ name: 'slotId' })
  slot: Slot;

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({
    comment: '슬롯 ID',
  })
  @RelationId((banner: Banner) => banner.slot)
  slotId: number;

  @Column({
    comment: '노출 순서',
    type: 'int',
  })
  sequence: number;

  @Column({
    comment: '연결된 링크 Url',
    type: 'text',
    nullable: true,
  })
  url?: string;

  @Column({
    comment: '배너 제목',
    type: 'varchar',
    length: 50,
  })
  title: string;

  @Column({
    comment: '배너 상세 설명',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  description?: string;

  @Column({
    comment: '플랫폼',
    type: 'varchar',
    length: 30,
  })
  platform: EBannerPlatform;

  @Column({
    comment: '이미지 Url',
    type: 'text',
  })
  imageUrl: string;

  @Column({ comment: '상태', type: 'varchar', length: 30 })
  status: EBannerStatus;

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
