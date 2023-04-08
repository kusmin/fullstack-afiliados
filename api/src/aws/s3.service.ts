// src/aws/s3.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { File } from 'multer';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadFile(file: File): Promise<void> {
    const { originalname, buffer } = file;

    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: originalname,
      Body: buffer,
    };

    await this.s3.upload(params).promise();
  }

  async downloadFile(filename: string): Promise<Readable> {
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: filename,
    };

    const fileStream = this.s3.getObject(params).createReadStream();
    return fileStream;
  }

  async deleteFile(filename: string): Promise<void> {
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: filename,
    };

    await this.s3.deleteObject(params).promise();
  }
}
