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
import { DOMAINS } from '@app/common/constants/domain.constant';
import { User } from '@app/common/entities';
import { ManyToOne } from '@app/common/decorators';

@Entity({ database: DOMAINS.User })
@Index(['userId', 'token'], { unique: true })
export class UserDevice {
  @ManyToOne(() => User, (user) => user.devices, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: '사용자 ID' })
  @RelationId((userDevice: UserDevice) => userDevice.user)
  userId: number;

  @Column({ comment: '기기 토큰', type: 'varchar', length: 255 })
  token: string;

  @Column({ comment: '기기 정보', type: 'varchar', length: 255 })
  info: string;

  @Column({ comment: '상태', type: 'varchar', length: 255 })
  status: string;

  @Column({ comment: '마지막 로그인 시간', type: 'datetime' })
  lastLoginDate: Date;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
