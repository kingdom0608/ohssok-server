import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnauthenticatedException } from '@app/authentication/exceptions';
import { EUserAccountProvider, EUserRole, EUserStatus } from '@app/common';
import { Algorithm, sign, verify } from 'jsonwebtoken';
import { v4 as uuidV4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class AuthenticationStrategy {
  private readonly aesCipherAlgorithm = 'aes-256-cbc';
  private readonly jwtAlgorithm: Algorithm = 'HS256';
  private readonly aesIV;
  private readonly aesKey;
  private readonly jwtKey;

  constructor(private readonly configService: ConfigService) {
    this.aesIV = Buffer.from(
      this.configService.get<string>('AUTHENTICATION_AES_IV'),
      'hex',
    );
    this.aesKey = this.configService.get<string>('AUTHENTICATION_AES_KEY');
    this.jwtKey = this.configService.get<string>('AUTHENTICATION_JWT_KEY');
  }

  /**
   * 암호화
   * @param plainText
   * @private
   */
  private encrypt(plainText: string): string {
    const sha256 = crypto.createHash('sha256');
    sha256.update(this.aesKey);
    const cipher = crypto.createCipheriv(
      this.aesCipherAlgorithm,
      sha256.digest(),
      this.aesIV,
    );
    const ciphertext = cipher.update(Buffer.from(plainText));
    const encrypted = Buffer.concat([ciphertext, cipher.final()]);
    return encrypted.toString('base64');
  }

  /**
   * 복호화
   * @param encrypted
   * @private
   */
  private decrypt(encrypted: string): string {
    const sha256 = crypto.createHash('sha256');
    sha256.update(this.aesKey);
    const ciphertext = Buffer.from(encrypted, 'base64');
    const decipher = crypto.createDecipheriv(
      this.aesCipherAlgorithm,
      sha256.digest(),
      this.aesIV,
    );
    return `${decipher.update(ciphertext)}${decipher.final()}`;
  }

  /**
   * 토큰 생성
   * @param plainText
   * @param expiresIn
   * @private
   */
  private createToken(plainText: string, expiresIn: number): string {
    return sign({ encrypted: this.encrypt(plainText) }, this.jwtKey, {
      algorithm: this.jwtAlgorithm,
      expiresIn: expiresIn * 60,
    });
  }

  /**
   * 토큰 발행
   * @param user
   */
  async issueToken(user: {
    id: number;
    name: string;
    displayName: string;
    phoneNumber: string;
    uid: string;
    provider: EUserAccountProvider;
    status: EUserStatus;
    role: EUserRole;
    createDate: Date;
    updateDate: Date;
  }) {
    const key = crypto.createHash('sha256').update(uuidV4()).digest('base64');
    const bodyString = JSON.stringify({
      key,
      user,
    });
    const accessTokenAfterMinutes = 720;
    const refreshTokenAfterMinutes = 43200;
    const accessToken = this.createToken(bodyString, accessTokenAfterMinutes);
    const refreshToken = this.createToken(bodyString, refreshTokenAfterMinutes);

    return { key, accessToken, refreshToken };
  }

  /**
   * 토큰 복호화
   * @param token
   * @private
   */
  decodeToken(token: string) {
    let decoded;
    try {
      /** accessToken 디코드
       * 40101 오류 리턴 (access 토큰을 갱신 지시)
       * */
      decoded = verify(token, this.jwtKey);
    } catch (err) {
      throw new UnauthenticatedException();
    }

    const encrypted = decoded['encrypted'];
    const decrypted = this.decrypt(encrypted);

    return JSON.parse(decrypted);
  }
}
