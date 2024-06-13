/**
 * 테스트 환경
 */
export const isTest = (): boolean => process.env.NODE_ENV === 'test';

/**
 * 로컬 환경
 */
export const isLocal = (): boolean => process.env.NODE_ENV === 'local';

/**
 * 개발 환경
 */
export const isDevelop = (): boolean => process.env.NODE_ENV === 'develop';

/**
 * 운영 환경
 */
export const isProduction = (): boolean =>
  process.env.NODE_ENV === 'production';

/**
 * 환경변수 파일 파싱
 */
export function parsedEnvFile() {
  switch (process.env.NODE_ENV) {
    case 'production':
      return 'env/production.env';
    case 'develop':
      return 'env/develop.env';
    case 'local':
      return 'env/local.env';
    case 'test':
      return 'env/test.env';
    default:
      throw new Error('stage is wrong');
  }
}
