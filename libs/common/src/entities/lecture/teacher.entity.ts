import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DOMAINS } from '@app/common/constants';
import { ETeacherStatus } from '@app/common/enums';
import { OneToMany } from '@app/common/decorators';
import { Lecture } from '@app/common/entities';

@Entity({ database: DOMAINS.Lecture })
export class Teacher {
  @OneToMany(() => Lecture, (lecture) => lecture.teacher, {
    cascade: true,
  })
  lectures: Lecture[];

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({
    comment: '이름',
    type: 'varchar',
    length: 50,
  })
  name: string;

  @Column({ comment: '상태', type: 'varchar', length: 30 })
  status: ETeacherStatus;

  @Column({ comment: '설명', type: 'text' })
  description: string;

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
