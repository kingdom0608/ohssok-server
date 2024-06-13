import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

import { DOMAINS } from '@app/common/constants';
import { ManyToOne, OneToMany } from '@app/common/decorators';
import { Lecture, UpperCategory } from '@app/common';
import { ECategoryStatus } from '@app/common/enums/lecture/category.enum';

@Entity({ database: DOMAINS.Lecture })
export class Category {
  @OneToMany(() => Lecture, (lecture) => lecture.category, {
    cascade: true,
  })
  lectures: Lecture[];

  @ManyToOne(() => UpperCategory, (upperCategory) => upperCategory.categories)
  upperCategory: UpperCategory;

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @RelationId((category: Category) => category.upperCategory)
  @Column({ comment: '상위 카테고리 ID' })
  upperCategoryId: number;

  @Column({
    comment: '상태',
    type: 'varchar',
    length: 30,
    default: ECategoryStatus.ACTIVE,
  })
  status: ECategoryStatus;

  @Column({ comment: '이름', type: 'varchar', length: 50 })
  name: string;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
