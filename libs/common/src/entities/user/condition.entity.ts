import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DOMAINS } from '@app/common/constants';
import { EConditionStatus, EConditionType } from '@app/common/enums';
import { DateColumn, OneToMany } from '@app/common/decorators';
import { UserConditionRelation } from '@app/common/entities';

@Entity({ database: DOMAINS.User })
export class Condition {
  @OneToMany(
    () => UserConditionRelation,
    (userConditionRelation) => userConditionRelation.condition,
  )
  userRelations: UserConditionRelation[];

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: '유형', type: 'varchar', length: 30 })
  type: EConditionType;

  @Column({ comment: '상태', type: 'varchar', length: 30 })
  status: EConditionStatus;

  @Column({ comment: '내용', type: 'longtext' })
  content: string;

  @DateColumn({ comment: '공고 일자', type: 'date' })
  publicDate: Date;

  @DateColumn({ comment: '시행 일자', type: 'date' })
  effectiveDate: Date;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
