import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { DOMAINS } from '@app/common/constants/domain.constant';
import { User } from '@app/common/entities';
import { EUserAccountProvider, EUserAccountStatus } from '@app/common/enums';
import { ManyToOne } from '@app/common/decorators';

@Entity({ database: DOMAINS.User })
@Index(['userId', 'provider'], { unique: true })
@Index(['uid'], { unique: false })
export class UserAccount {
  @ManyToOne(() => User, (user) => user.accounts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: '유저 ID' })
  @RelationId((userAccount: UserAccount) => userAccount.user)
  userId: number;

  @Column({ comment: '계정 ID', type: 'varchar', length: 50 })
  uid: string;

  @Column({ comment: '비밀번호', type: 'varchar', length: 255, nullable: true })
  password?: string;

  @Column({ comment: '상태', type: 'varchar', length: 30 })
  status: EUserAccountStatus;

  @Column({ comment: '제공자', type: 'varchar', length: 30 })
  provider: EUserAccountProvider;

  @Column({ comment: '리프레시 토큰', type: 'text', nullable: true })
  refreshToken?: string;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
