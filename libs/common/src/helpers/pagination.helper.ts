export interface IFindPaginationQuery {
  offset?: number;
  size?: number;
  page?: number;
  sortBy?: string;
}

export interface IResponsePagination {
  totalRow: number;
  pageRow: number;
  hasNext: boolean;
  totalPage: number;
  page: number;
  size: number;
}

/**
 * typeorm find options 에서 사용하는 pagination 값
 * relation 관계에서 order 사용 불가
 * order default id 내림차순
 * Usage: repository.find({...findPagination(query)})
 * @param query
 */
export function findPagination(query: IFindPaginationQuery) {
  const { offset, page, size, sortBy } = query;
  const listSort = sortBy ? sortBy.split(',') : [];

  const order = listSort.reduce((acc, cur) => {
    const [column, ordering] = cur.split('-');
    acc[column] = ordering;
    return acc;
  }, {});

  return {
    skip: page ? (page - 1) * size : offset,
    take: size,
    order: Object.keys(order).length > 0 ? order : { id: 'DESC' },
  };
}

/**
 * 응답 값 중 pagination 계산 후 리턴
 * @param total
 * @param count
 * @param query
 */
export function responsePagination(
  total: number,
  count: number,
  query: IFindPaginationQuery,
): IResponsePagination {
  const page = query.page ? query.page : 1;
  const totalPage = Math.ceil(total / query.size) || 1;
  return {
    totalRow: total,
    pageRow: count,
    hasNext: totalPage > page,
    totalPage: totalPage,
    page: page,
    size: query.size,
  };
}
