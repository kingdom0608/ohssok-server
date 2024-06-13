import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DOMAINS } from '@app/common/constants/domain.constant';
import { User } from '@app/common/entities';
import { ManyToOne } from '@app/common/decorators';

@Entity({ database: DOMAINS.User })
export class UserRelation {
  @ManyToOne(() => User, (user) => user.children)
  @JoinColumn({ name: 'childId' })
  child: User;

  @ManyToOne(() => User, (user) => user.parents)
  @JoinColumn({ name: 'parentId' })
  parent: User;

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
