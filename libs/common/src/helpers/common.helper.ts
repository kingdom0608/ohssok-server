import * as _ from 'lodash';

/**
 * 이메일 형식 검증
 * @param email
 */
export function validateIsEmailFormat(email: string): boolean {
  const checkEmailRegExp = new RegExp(
    /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
  );

  return checkEmailRegExp.test(email);
}

/**
 * 수정 시 삭제 그리고 수정 그리고 삭제 데이터 리턴
 * @param previousData
 * @param nextData
 * @param iteratee
 */
export function updateForDeleteAndUpdateAndCreate(
  previousData: object[],
  nextData: object[],
  iteratee = 'id',
): {
  createData: object[];
  updateData: object[];
  deleteData: object[];
} {
  const createData = [];
  for (const row of nextData) {
    if (!row[iteratee]) {
      createData.push(row);
    }
  }

  const updateData = _.intersectionBy(nextData, previousData, iteratee);
  const deleteData = _.differenceBy(previousData, nextData, iteratee);

  return {
    createData: createData,
    updateData: updateData,
    deleteData: deleteData,
  };
}

/**
 * 중복 여부를 확인 하는 함수
 */
export function isDuplicateKeyValue(
  array: any[],
  key: string,
  value: string | number | boolean,
): boolean {
  const filteredArray = array.filter((item) => item[key] === value);

  return filteredArray.length > 1;
}

/**
 * 필수 값 포함 여부를 확인 하는 함수
 * @param array
 * @param key
 * @param value
 */
export function isRequireKeyValue(
  array: any[],
  key: string,
  value: string | number | boolean,
): boolean {
  const filteredArray = array.filter((item) => item[key] === value);

  return filteredArray.length !== 1;
}

/**
 * 입력 받은 두 객체 내 값이 다른 키 값 문자열 반환
 * @returns string[]
 * @param obj1
 * @param obj2
 */
export function findDifferences(obj1: object, obj2: object): string[] {
  const differences: string[] = [];

  function compare(
    currentObj1: object,
    currentObj2: { [x: string]: any },
    keyPath = '',
  ): void {
    _.forEach(currentObj1, (value, key) => {
      const newKeyPath = keyPath ? `${keyPath}.${key}` : key;

      if (_.isObject(value) && _.isObject(currentObj2[key])) {
        compare(value, currentObj2[key], newKeyPath);
      } else if (
        _.has(currentObj2, key) &&
        !_.isEqual(value, currentObj2[key])
      ) {
        differences.push(newKeyPath);
      }
    });
  }

  compare(obj1, obj2);

  return differences;
}
