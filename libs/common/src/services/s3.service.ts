import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ES3ErrorMessageEnum } from '@app/common/enums';
import {
  S3Client,
  CreateMultipartUploadCommand,
  AbortMultipartUploadCommand,
  UploadPartCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommandInput,
  GetObjectCommandInput,
  DeleteObjectCommandInput,
  ListMultipartUploadsCommand,
  CompleteMultipartUploadCommand,
  UploadPartCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as process from 'process';

export class S3Service {
  private readonly client;
  constructor() {
    this.client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });
  }

  getPublicBucket(): string {
    return process.env.AWS_S3_PUBLIC_BUCKET;
  }

  getPrivateBucket(): string {
    return process.env.AWS_S3_PRIVATE_BUCKET;
  }

  /**
   * S3 파일 생성
   * @param fileData
   */
  async createFile(fileData) {
    const params: PutObjectCommandInput = {
      Bucket: fileData.bucket,
      Key: fileData.key,
      Body: fileData.body,
      Metadata: fileData.metadata,
    };
    if (fileData.contentType) params.ContentType = fileData.contentType;
    if (fileData.acl) params.ACL = fileData.acl;

    return this.client.send(new PutObjectCommand(params));
  }

  /** S3 파일 조회 */
  async getFile(fileData: any) {
    const params: GetObjectCommandInput = {
      Bucket: fileData.bucket,
      Key: fileData.key,
    };

    return this.client.send(new GetObjectCommand(params));
  }

  /** S3 파일 삭제 */
  async deleteFile(fileData: any) {
    const params: DeleteObjectCommandInput = {
      Bucket: fileData.bucket,
      Key: fileData.key,
    };

    return this.client.send(new DeleteObjectCommand(params));
  }

  /** S3 인증 url 생성 */
  async createSignUrl(fileData: any) {
    const params: PutObjectCommandInput = {
      Bucket: fileData.bucket,
      Key: fileData.key,
      ACL: 'public-read',
    };
    const command = new PutObjectCommand(params);

    return getSignedUrl(this.client, command, { expiresIn: 180 });
  }

  /** S3 인증 url 조회 */
  async getSignUrl(fileData: any) {
    /** 3일로 접근 제한*/
    const { expiresIn = 259200 } = fileData;
    const params: GetObjectCommandInput = {
      Bucket: fileData.bucket,
      Key: fileData.key,
    };

    if (fileData.responseContentDisposition)
      params.ResponseContentDisposition = fileData.responseContentDisposition;
    const command = new GetObjectCommand(params);

    return getSignedUrl(this.client, command, { expiresIn: expiresIn });
  }

  /** 멀티파트 부분 업로드 url 생성 */
  async getMultipartPartUploadSignUrl(fileData: any) {
    const params: UploadPartCommandInput = {
      Bucket: fileData.bucket,
      Key: fileData.key,
      PartNumber: fileData.partNumber,
      UploadId: fileData.uploadId,
    };
    const command = new UploadPartCommand(params);

    return getSignedUrl(this.client, command, { expiresIn: 86400 });
  }

  /**
   * 퍼블릭 이미지 파일 생성 및 url 반환
   */
  async createPublicImageFiles(
    files: { key: string; image: Express.Multer.File }[],
  ) {
    const promises = files.map(async (file) => {
      if (/[`~!@#$%^&*|\\\'\";:\/?]/gi.test(file.image.originalname)) {
        throw new BadRequestException(
          ES3ErrorMessageEnum.S3_BAD_REQUEST_FILE_NAME,
        );
      }

      if (!/\.(jpe?g|png|webp)$/i.test(file.image.originalname)) {
        throw new BadRequestException(
          ES3ErrorMessageEnum.S3_BAD_REQUEST_INVALID_IMAGE_FILE_EXTENSION,
        );
      }

      const bucket = this.getPublicBucket();

      const body = file.image.buffer;

      const acl = 'public-read';

      const metadata = {
        filename: Buffer.from(file.image.originalname).toString('base64'),
      };

      /** S3 파일 생성 */
      await this.createFile({
        bucket,
        key: file.key,
        body,
        contentType: file.image.mimetype,
        metadata,
        acl,
      });

      return {
        bucket,
        key: file.key,
        fileName: file.image.originalname,
        filePath: file.key,
        url: `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.key}`,
      };
    });

    try {
      return await Promise.all(promises);
    } catch (error) {
      throw new InternalServerErrorException(
        `${ES3ErrorMessageEnum.S3_UPLOAD_FAILED}: ${error.message}`,
      );
    }
  }
  /** 대용량 파일 업로드 초기화 */
  async createMultipartUploadId(createUploadData: {
    bucket: string;
    key: string;
  }): Promise<string> {
    try {
      const commend = new CreateMultipartUploadCommand({
        Bucket: createUploadData.bucket,
        Key: createUploadData.key,
      });
      const { UploadId } = await this.client.send(commend);

      return UploadId;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 각 요청에는 initiation에서 받은 unique id를 포함해야 한다.
   * 각 파트마다 파트 번호를 명시해야한다. 파트번호는 1부터 10,000까지 가능하고, 연속적일 필요는 없으며 순차적으로 증가하기만 하면 된다. 예를 들어 파트 번호들이 [1, 2, 3, 4, 5] 가 아니라 [1, 3, 5, 7, 9] 여도 문제없이 동작한다.
   * 각각의 파트는 최소 5MB 이상이어야 한다. (마지막 파트 제외. 마지막 파트는 5MB 이하 가능)
   * 이 때 5MB는 5MiB = 5 * 1024 * 1024 byte 이다.
   * @param uploadParamData
   */
  async uploadMultipartChunk(uploadParamData: {
    file: Buffer;
    bucket: string;
    key: string;
    partNumber: number;
    uploadId: string;
  }): Promise<string> {
    try {
      const commend = new UploadPartCommand({
        Body: uploadParamData.file,
        Bucket: uploadParamData.bucket,
        Key: uploadParamData.key,
        PartNumber: uploadParamData.partNumber,
        UploadId: uploadParamData.uploadId,
      });
      const { ETag } = await this.client.send(commend);
      return ETag;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 업로드 완료 표시 하기
   * @param completeUploadData
   */
  async completeUploadMultipart(completeUploadData: {
    bucket: string;
    key: string;
    parts: { etag: string; partNumber: number }[];
    uploadId: string;
  }) {
    try {
      const commend = new CompleteMultipartUploadCommand({
        Bucket: completeUploadData.bucket,
        Key: completeUploadData.key,
        UploadId: completeUploadData.uploadId,
        MultipartUpload: {
          Parts: completeUploadData.parts.map((x) => {
            return {
              ETag: x.etag,
              PartNumber: x.partNumber,
            };
          }),
        },
      });
      await this.client.send(commend);
      return 'success';
    } catch (err) {
      throw err;
    }
  }

  /**
   * 완료되지 않은 파일 삭제
   * @param abortUploadData
   */
  async abortMultipartUpload(abortUploadData: {
    bucket: string;
    key: string;
    uploadId: string;
  }) {
    try {
      const commend = new AbortMultipartUploadCommand({
        Bucket: abortUploadData.bucket,
        Key: abortUploadData.key,
        UploadId: abortUploadData.uploadId,
      });
      await this.client.send(commend);

      return 'success';
    } catch (e) {
      throw e;
    }
  }

  /**
   * 버킷에 남아있는 멀티파트 업로드 조회
   * @param uploadParam
   */
  async listMultipartUpload(uploadParam: {
    bucket: string;
    key: string;
    uploadId: string;
  }) {
    const commend = new ListMultipartUploadsCommand({
      Bucket: uploadParam.bucket,
    });
    const result = await this.client.send(commend);
    return result;
  }
}
