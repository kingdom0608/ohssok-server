import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DOMAINS } from '@app/common/constants';
import { OneToMany } from '@app/common/decorators';
import { Category } from '@app/common/entities';
import { EUpperCategoryStatus } from '@app/common/enums/lecture/upper-category.enum';

@Entity({ database: DOMAINS.Lecture })
export class UpperCategory {
  @OneToMany(() => Category, (category) => category.upperCategory, {
    cascade: true,
  })
  categories: Category[];

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({
    comment: '상태',
    type: 'varchar',
    length: 30,
    default: EUpperCategoryStatus.ACTIVE,
  })
  status: EUpperCategoryStatus;

  @Column({ comment: '이름', type: 'varchar', length: 50 })
  name: string;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
