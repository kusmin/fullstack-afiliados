// src/aws/aws.controller.ts
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Multer } from 'multer';
import { S3Service } from './s3.service';

@Controller('aws')
export class AwsController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Multer.File): Promise<void> {
    await this.s3Service.uploadFile(file);
  }

  @Get('download/:filename')
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    const fileStream = await this.s3Service.downloadFile(filename);
    fileStream.pipe(res);
  }

  @Delete('delete/:filename')
  async deleteFile(@Param('filename') filename: string): Promise<void> {
    await this.s3Service.deleteFile(filename);
  }
}
