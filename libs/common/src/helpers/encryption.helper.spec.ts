import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { EncryptionHelper } from '@app/common';

describe('EncryptionHelper', () => {
  let encryptionHelper: EncryptionHelper;
  let encryptData;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/test.env',
        }),
        EncryptionHelper,
      ],
      controllers: [],
      providers: [],
    }).compile();

    encryptionHelper = app.get<EncryptionHelper>(EncryptionHelper);
  });

  it('encryptForPassword', () => {
    const result = encryptionHelper.encryptForPassword('encryptForPassword');
    // console.log(result);
    expect(result).toEqual('02a411d733024d65f131a1333c605249e6ff8327');
  });

  it('encrypt', () => {
    const result = encryptionHelper.encrypt('encrypt');
    // console.log(result);
    encryptData = result;
    expect(result.length).toEqual(44);
  });

  it('decrypt', () => {
    const result = encryptionHelper.decrypt(encryptData);
    // console.log(result);
    expect(result).toEqual('encrypt');
  });
});
