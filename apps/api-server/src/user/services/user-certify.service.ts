import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DOMAINS,
  EUserCertifyErrorMessage,
  EUserCertifyStatus,
  UserCertify,
} from '@app/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserCertifyService {
  constructor(
    @InjectDataSource(DOMAINS.User)
    private dataSource: DataSource,
    @InjectRepository(UserCertify, DOMAINS.User)
    private readonly userCertifyRepository: Repository<UserCertify>,
  ) {}

  /**
   * 유저 인증 생성
   * @param createUserCertifyData
   */
  async createUserCertify(createUserCertifyData: {
    phoneNumber: string;
    code: string;
  }): Promise<UserCertify> {
    let createUserCertify;

    await this.dataSource.transaction(async (manager: EntityManager) => {
      /** 기존 인증 정보 삭제 */
      await manager.softDelete(UserCertify, {
        phoneNumber: createUserCertifyData.phoneNumber,
      });

      /** 인증 정보 생성 */
      createUserCertify = manager.create(UserCertify, {
        ...createUserCertifyData,
        status: EUserCertifyStatus.INACTIVE,
      });

      await manager.save(createUserCertify);
    });

    delete createUserCertify.code;

    return createUserCertify;
  }

  /**
   * 유저 인증 전화번호 조회
   * @param phoneNumber
   */
  async getUserCertifyByPhoneNumber(phoneNumber: string): Promise<UserCertify> {
    const getUserCertify = await this.userCertifyRepository.findOne({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (!getUserCertify) {
      throw new NotFoundException(
        EUserCertifyErrorMessage.USER_CERTIFY_UNKNOWN,
      );
    }

    return getUserCertify;
  }

  /**
   * 활성화된 유저 인증 전화번호 조회
   * @param phoneNumber
   */
  async getActiveUserCertifyByPhoneNumber(
    phoneNumber: string,
  ): Promise<UserCertify> {
    const getUserCertify = await this.userCertifyRepository.findOne({
      where: {
        phoneNumber: phoneNumber,
        status: EUserCertifyStatus.ACTIVE,
      },
    });

    if (!getUserCertify) {
      throw new NotFoundException(
        EUserCertifyErrorMessage.USER_CERTIFY_UNKNOWN,
      );
    }

    return getUserCertify;
  }

  /**
   * 유저 인증 수정
   * @param phoneNumber
   * @param updateUserCertifyData
   */
  async updateUserCertifyByPhoneNumber(
    phoneNumber: string,
    updateUserCertifyData: {
      status: EUserCertifyStatus;
    },
  ): Promise<UserCertify> {
    /** 유저 인증 정보 확인 */
    await this.getUserCertifyByPhoneNumber(phoneNumber);

    /** 유저 인증 업데이트 */
    await this.userCertifyRepository.update(
      {
        phoneNumber: phoneNumber,
      },
      {
        status: updateUserCertifyData.status,
      },
    );

    return this.getUserCertifyByPhoneNumber(phoneNumber);
  }

  /**
   * 유저 인증 정보 삭제
   * @param phoneNumber
   */
  async deleteUserCertifyByPhoneNumber(phoneNumber: string) {
    return this.userCertifyRepository.softDelete({
      phoneNumber: phoneNumber,
    });
  }
}
