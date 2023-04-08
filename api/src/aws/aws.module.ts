// src/aws/aws.module.ts
import { Module } from '@nestjs/common';
import { AwsController } from './aws.controller';
import { S3Service } from './s3.service';

@Module({
  imports: [],
  controllers: [AwsController],
  providers: [S3Service],
  exports: [S3Service],
})
export class AwsModule {}
