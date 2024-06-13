import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from '@app/common';

describe('S3Service', () => {
  let s3Service: S3Service;
  const bucket = 'ohssok-private-local-file';
  const key = 'lectures/01';
  const file = {
    buffer: '',
    originalname: 'lecture',
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/test.env',
        }),
        S3Service,
      ],
    }).compile();

    s3Service = app.get<S3Service>(S3Service);
  });

  it('createFile', async () => {
    const result = await s3Service.createFile({
      bucket: bucket,
      key: key,
      body: 'test.jpeg',
      metadata: {
        filename: Buffer.from(file.originalname).toString('base64'),
      },
    });
    // console.log(result);
    expect(result.$metadata.httpStatusCode).toEqual(200);
  });

  it('getFile', async () => {
    const result = await s3Service.getFile({
      bucket: bucket,
      key: key,
    });
    // console.log(result);
    expect(result.$metadata.httpStatusCode).toEqual(200);
  });

  it('deleteFile', async () => {
    const result = await s3Service.deleteFile({
      bucket: bucket,
      key: key,
    });
    // console.log(result);
    expect(result.$metadata.httpStatusCode).toEqual(204);
  });
});
