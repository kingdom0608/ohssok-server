import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Condition, DOMAINS, ManyToOne, User } from '@app/common';

@Entity({ database: DOMAINS.User })
export class UserConditionRelation {
  @ManyToOne(() => User, (user) => user.conditionRelations)
  user: User;

  @ManyToOne(() => Condition, (condition) => condition.userRelations)
  condition: Condition;

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: '유저 ID' })
  @RelationId(
    (userConditionRelation: UserConditionRelation) =>
      userConditionRelation.user,
  )
  userId: number;

  @Column({ comment: '약관 ID' })
  @RelationId(
    (userConditionRelation: UserConditionRelation) =>
      userConditionRelation.condition,
  )
  conditionId: number;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
