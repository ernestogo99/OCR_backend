import { Injectable, StreamableFile, Logger } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { File } from 'multer';
import crypto from 'crypto';

@Injectable()
export class MinIoService {
  private readonly logger = new Logger(MinIoService.name);

  private s3: S3Client;

  constructor() {
    if (
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY ||
      !process.env.AWS_SESSION_TOKEN
    ) {
      this.logger.warn('⚠️ AWS credentials missing or session token missing!');
    } else {
      this.logger.log(
        `✅ AWS credentials found. Session token length: ${process.env.AWS_SESSION_TOKEN.length}`,
      );
    }

    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        sessionToken: process.env.AWS_SESSION_TOKEN!,
      },
      forcePathStyle: true, // só mude para false se estiver usando S3 real
    });
  }

  async upload(file: File) {
    const key = `${crypto.randomUUID()}-${file.originalname}`;

    try {
      this.logger.log(`Uploading file to S3: ${key}`);
      await this.s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
      this.logger.log(`Upload successful: ${key}`);
      return key;
    } catch (e: any) {
      this.logger.error(`S3 Upload failed: ${e.message}`);
      throw e;
    }
  }

  async getFileUrl(key: string): Promise<string> {
    try {
      this.logger.log(`Generating signed URL for key: ${key}`);
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
      });
      const url = await getSignedUrl(this.s3, command, {
        expiresIn: 60 * 60 * 24 * 7,
      });
      this.logger.log(`Signed URL generated for key: ${key}`);
      return url;
    } catch (e: any) {
      this.logger.error(`Failed to generate signed URL: ${e.message}`);
      throw e;
    }
  }

  async downloadFile(key: string): Promise<StreamableFile> {
    try {
      this.logger.log(`Downloading file from S3: ${key}`);
      const response = await this.s3.send(
        new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: key,
        }),
      );
      this.logger.log(`Download successful: ${key}`);
      return new StreamableFile(response.Body as any, {
        type: response.ContentType,
        disposition: `attachment; filename="${key}"`,
      });
    } catch (e: any) {
      this.logger.error(`S3 Download failed: ${e.message}`);
      throw e;
    }
  }
}
