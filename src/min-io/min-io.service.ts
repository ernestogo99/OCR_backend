import { Injectable, StreamableFile } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { File } from 'multer';

@Injectable()
export class MinIoService {
  private s3 = new S3Client({
    endpoint: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`,
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY!,
      secretAccessKey: process.env.MINIO_SECRET_KEY!,
    },
    forcePathStyle: true,
  });

  async upload(file: File) {
    const key = `${crypto.randomUUID()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.MINIO_BUCKET!,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return key;
  }

  async getFileUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.MINIO_BUCKET!,
      Key: key,
    });

    return getSignedUrl(this.s3, command, { expiresIn: 3600 * 3600 });
  }

  async downloadFile(key: string): Promise<StreamableFile> {
    const response = await this.s3.send(
      new GetObjectCommand({
        Bucket: process.env.MINIO_BUCKET!,
        Key: key,
      }),
    );

    return new StreamableFile(response.Body as any, {
      type: response.ContentType,
      disposition: `attachment; filename="${key}"`,
    });
  }
}
