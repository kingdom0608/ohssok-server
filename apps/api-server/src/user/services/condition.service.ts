import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Condition,
  DOMAINS,
  EConditionErrorMessage,
  EConditionStatus,
  EConditionType,
  findPagination,
  IFindPaginationQuery,
  responsePagination,
} from '@app/common';
import { Repository } from 'typeorm';

export interface IListConditionQuery extends IFindPaginationQuery {
  type?: EConditionType;
  status?: EConditionStatus;
  content?: string;
  publicDate?: Date;
  effectiveDate?: Date;
}

@Injectable()
export class ConditionService {
  constructor(
    @InjectRepository(Condition, DOMAINS.User)
    private readonly conditionRepository: Repository<Condition>,
  ) {}

  /**
   * 약관 생성
   * @param conditionData
   */
  async createCondition(conditionData: {
    type: EConditionType;
    status: EConditionStatus;
    content: string;
    publicDate: Date;
    effectiveDate: Date;
  }) {
    const getActiveCondition = await this.getActiveConditionByType(
      conditionData.type,
    );

    /** 활성 약관 타입은 1개만 가능 */
    if (getActiveCondition) {
      throw new ConflictException(
        EConditionErrorMessage.CONDITION_CONFLICT_TYPE,
      );
    }

    const createCondition = await this.conditionRepository.create({
      ...conditionData,
    });

    return this.conditionRepository.save(createCondition);
  }

  /**
   * 약관 목록
   * @param query
   */
  async listCondition(query: IListConditionQuery) {
    const { offset, page, size, sortBy, ...data } = query;
    const where = {
      ...data,
    };

    const [list, total] = await this.conditionRepository.findAndCount({
      where: where,
      ...findPagination({ offset, page, size, sortBy }),
    });

    const pagination = responsePagination(total, list.length, query);

    return { list: list, pagination: pagination };
  }

  /**
   * 약관 아이디 조회
   * @param id
   */
  async getConditionById(id: number) {
    const getCondition = await this.conditionRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!getCondition) {
      throw new NotFoundException(EConditionErrorMessage.CONDITION_NOT_FOUND);
    }

    return getCondition;
  }

  /**
   * 활성 약관 타입 조회
   * @param type
   */
  async getActiveConditionByType(type: EConditionType) {
    return this.conditionRepository.findOne({
      where: {
        type: type,
        status: EConditionStatus.ACTIVE,
      },
    });
  }

  /**
   * 약관 아이디 업데이트
   * @param id
   * @param conditionData
   */
  async updateConditionById(
    id: number,
    conditionData: {
      type?: EConditionType;
      status?: EConditionStatus;
      content?: string;
      publicDate?: Date;
      effectiveDate?: Date;
    },
  ) {
    await this.getConditionById(id);

    await this.conditionRepository.update(id, conditionData);

    return this.getConditionById(id);
  }

  /**
   * 약관 아이디 삭제
   * @param id
   */
  async deleteConditionById(id: number) {
    const getCondition = await this.getConditionById(id);

    await this.conditionRepository.softDelete({
      id: id,
    });

    return getCondition;
  }
}
