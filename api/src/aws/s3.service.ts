import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Readable } from 'stream';
import { Repository } from 'typeorm';
import { Arquivo } from '../models/arquivo.entity';

@Injectable()
export class S3Service {
  private s3: S3;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Arquivo)
    private arquivoRepository: Repository<Arquivo>,
  ) {
    this.s3 = new S3({
      endpoint: this.configService.get('AWS_S3_ENDPOINT'),
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadFile(file: Express.Multer.File, id: number): Promise<Arquivo> {
    const { originalname, buffer, mimetype } = file;

    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: originalname,
      Body: buffer,
    };

    const result = await this.s3.upload(params).promise();
    const arquivo = new Arquivo();
    arquivo.nomeDoArquivo = originalname;
    arquivo.mimeType = mimetype;
    arquivo.bucket = params.Bucket;
    arquivo.url = result.Location;
    arquivo.userId = id;

    return await this.arquivoRepository.save(arquivo);
  }

  async updateFile(
    arquivo: Arquivo,
    file: Express.Multer.File,
  ): Promise<Arquivo> {
    const { originalname, buffer, mimetype } = file;

    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: originalname,
      Body: buffer,
    };

    const result = await this.s3.upload(params).promise();
    arquivo.nomeDoArquivo = originalname;
    arquivo.mimeType = mimetype;
    arquivo.bucket = params.Bucket;
    arquivo.url = result.Location;

    return await this.arquivoRepository.save(arquivo);
  }

  async downloadFile(
    id: number,
  ): Promise<{ stream: Readable; mimeType: string; filename: string }> {
    const arquivo = await this.getArquivoById(id);

    if (!arquivo) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    if (arquivo.isExcluido) {
      throw new HttpException('Arquivo já excluído', HttpStatus.BAD_REQUEST);
    }

    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: arquivo.nomeDoArquivo,
    };

    const fileStream = this.s3.getObject(params).createReadStream();
    if (!fileStream) {
      throw new HttpException('Arquivo excluído do S3', HttpStatus.BAD_REQUEST);
    }
    return {
      stream: fileStream,
      mimeType: arquivo.mimeType,
      filename: arquivo.nomeDoArquivo,
    };
  }

  async deleteFile(id: number): Promise<void> {
    const arquivo = await this.getArquivoById(id);

    if (!arquivo) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    if (!arquivo.isExcluido) {
      const params = {
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Key: arquivo.nomeDoArquivo,
      };

      await this.s3.deleteObject(params).promise();

      arquivo.isExcluido = true;
      arquivo.dataExclusao = new Date();

      await this.arquivoRepository.save(arquivo);
    } else {
      throw new HttpException('Arquivo já excluído', HttpStatus.BAD_REQUEST);
    }
  }
  async replaceFile(id: number, file: Express.Multer.File): Promise<Arquivo> {
    const arquivo = await this.getArquivoById(id);

    if (!arquivo) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    if (arquivo.isExcluido) {
      throw new HttpException('Arquivo já excluído', HttpStatus.BAD_REQUEST);
    }

    // Deletar o arquivo antigo do S3
    await this.deleteFileFromS3(arquivo.nomeDoArquivo);

    // Atualizar o arquivo no S3 e no banco de dados
    return await this.updateFile(arquivo, file);
  }

  private async deleteFileFromS3(filename: string): Promise<void> {
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: filename,
    };

    await this.s3.deleteObject(params).promise();
  }

  async getArquivoById(id: number): Promise<Arquivo> {
    return await this.arquivoRepository.findOne({ where: { id } });
  }
}
