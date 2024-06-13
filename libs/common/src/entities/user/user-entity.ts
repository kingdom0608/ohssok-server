import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DOMAINS } from '@app/common/constants/domain.constant';
import {
  UserAccount,
  UserDevice,
  UserRelation,
  UserConditionRelation,
} from '@app/common/entities';
import { EUserRole, EUserStatus } from '@app/common/enums';
import { DateColumn, OneToMany } from '@app/common/decorators';

@Entity({ database: DOMAINS.User })
@Index(['name'], { unique: false })
@Index(['phoneNumber'], { unique: false })
export class User {
  @OneToMany(() => UserAccount, (userAccount) => userAccount.user, {
    cascade: true,
  })
  accounts: UserAccount[];

  @OneToMany(() => UserDevice, (userDevice) => userDevice.user, {
    cascade: true,
  })
  devices: UserDevice[];

  @OneToMany(
    () => UserConditionRelation,
    (userConditionRelation) => userConditionRelation.user,
    {
      cascade: true,
    },
  )
  conditionRelations: UserConditionRelation[];

  @OneToMany(() => UserRelation, (userRelation) => userRelation.child)
  children: UserRelation[];

  @OneToMany(() => UserRelation, (userRelation) => userRelation.parent)
  parents: UserRelation[];

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({
    comment: '이름',
    type: 'varchar',
    length: 50,
  })
  name: string;

  @Column({
    comment: '노출 이름',
    type: 'varchar',
    length: 50,
  })
  displayName: string;

  @Column({ comment: '전화번호', type: 'varchar', length: 30 })
  phoneNumber: string;

  @DateColumn({ comment: '생년월일', type: 'date' })
  birthday: Date;

  @Column({ comment: '도로명 or 지번 주소', type: 'varchar', length: 255 })
  address: string;

  @Column({ comment: '우편 번호', type: 'varchar', length: 255 })
  zipCode: string;

  @Column({ comment: '상세 주소', type: 'varchar', length: 255 })
  detailAddress: string;

  @Column({ comment: '상태', type: 'varchar', length: 30 })
  status: EUserStatus;

  @Column({ comment: '역할', type: 'varchar', length: 30 })
  role: EUserRole;

  @Column({
    comment: '프로필 이미지 Url',
    type: 'text',
    nullable: true,
  })
  profileImageUrl?: string;

  @CreateDateColumn({ comment: '생성 일자' })
  createDate: Date;

  @UpdateDateColumn({ comment: '수정 일자' })
  updateDate: Date;

  @DeleteDateColumn({ comment: '삭제 일자', nullable: true })
  deleteDate?: Date;
}
