import { Injectable, Logger } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import axios from 'axios';
import { S3SignedUrlEntity } from '@repo/api/s3';

@Injectable()
export class S3Service {
  private logger = new Logger('S3Service');
  private s3Client: S3Client | null = null;
  private bucketName = '';

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME') || '';
    const region = this.configService.get('AWS_DEFAULT_REGION') || '';
    const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID') || '';
    const secretAccessKey =
      this.configService.get('AWS_SECRET_ACCESS_KEY') || '';
    if (!this.bucketName || !region || !accessKeyId || !secretAccessKey) {
      this.logger.error(
        'AWS S3 configuration is not properly set in environment variables.',
      );
      return;
    }
    this.s3Client = new S3Client({
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
  }

  async put(key: string, body: string) {
    return this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: body,
        ContentType: 'text/plain',
      }),
    );
  }

  async putPDF(key: string, body: Buffer) {
    return this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: body,
        ContentType: 'application/pdf',
      }),
    );
  }

  async getSignedUrl(fileName: string, fileType: string) {
    const key = `${Date.now()}_${fileName}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: fileType,
      ACL: 'public-read',
    });
    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600, // 1 hour
    });
    return {
      signedUrl: signedUrl,
      key: key,
    } as S3SignedUrlEntity;
  }

  async generatePreSignedUrl(objectKey: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
    });
    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });
    return signedUrl;
  }

  async downloadToTmp(imageUrl: string, filePath: string): Promise<void> {
    const writer = fs.createWriteStream(filePath);
    const response = await axios.get(imageUrl, { responseType: 'stream' });

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  async uploadFile(key: string, file: Buffer, contentType: string) {
    return this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType: contentType,
      }),
    );
  }
}
