import * as voucher_codes from 'voucher-code-generator';

/**
 * shortId 생성
 * @returns string
 */
export function shortId(length = 10, isLowerCase = true): string {
  const shortId = voucher_codes.generate({
    length,
    charset: voucher_codes.charset('alphanumeric'),
  });

  return isLowerCase ? shortId[0].toLowerCase() : shortId[0];
}

/**
 * shortNumberId 생성
 * @returns string
 */
export function shortNumberId(length = 6): string {
  let shortNumberId = voucher_codes.generate({
    length,
    charset: voucher_codes.charset('numbers'),
  });
  shortNumberId = shortNumberId[0];
  return shortNumberId;
}
