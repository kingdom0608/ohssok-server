import * as CryptoJS from 'crypto-js';
import * as pbkdf2 from 'pbkdf2';
export class EncryptionHelper {
  /** salt 값 */
  salt;

  /** 암호화 방식 */
  digest;

  /** 암호화 횟수 */
  iterations;

  /** 암호화 길이 */
  keyLength;

  constructor() {
    this.salt = process.env.ENC_SALT;
    this.digest = process.env.ENC_DIGEST;
    this.iterations = 5;
    this.keyLength = 20;
  }

  /**
   * 비밀번호 암호화
   * @return string
   * @param plainText
   */
  encryptForPassword(plainText: string): string {
    const derivedKey = pbkdf2.pbkdf2Sync(
      plainText,
      this.salt,
      this.iterations,
      this.keyLength,
      this.digest,
    );
    return derivedKey.toString('hex');
  }

  /**
   * 암호화
   * @param plainText
   * @return string
   */
  encrypt(plainText: string) {
    return CryptoJS.AES.encrypt(plainText, this.salt).toString();
  }

  /**
   * 복호화
   * @param encryptText
   * @return string
   */
  decrypt(encryptText: string) {
    const bytes = CryptoJS.AES.decrypt(encryptText.toString(), this.salt);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
