import { Injectable } from '@nestjs/common';
import { createInterface } from 'readline';
import { S3Service } from 'src/aws/s3.service';
import { Readable } from 'stream';
import { ProcessedData } from '../models/processed-data.entity';
import { Transaction } from '../models/transaction.entity';
import { TransactionService } from './transaction.service';

@Injectable()
export class TransactionProcessorService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly transactionService: TransactionService,
  ) {}

  async processTransactionFile(transaction: Transaction): Promise<void> {
    try {
      transaction.status = 'PROCESSANDO';
      await this.transactionService.updateTransaction(transaction);

      const { stream } = await this.s3Service.download(transaction.arquivo);

      const validationResult = await this.validateFile(stream);

      if (validationResult.errors.length > 0) {
        transaction.status = 'ERRO';
        transaction.errors = validationResult.errors;
      } else {
        await this.processFile(stream, transaction);

        transaction.status = 'PROCESSADO';
      }
    } catch (error) {
      transaction.status = 'ERRO';
      transaction.errors = [error.message];
    } finally {
      await this.transactionService.updateTransaction(transaction);
    }
  }

  private validateFile(stream: Readable): Promise<{ errors: string[] }> {
    return new Promise((resolve, reject) => {
      const errors: string[] = [];
      const rl = createInterface({ input: stream });

      let lineNumber = 1;
      rl.on('line', (line) => {
        const lineErrors = this.validateLine(line, lineNumber);
        if (lineErrors.length > 0) {
          errors.push(...lineErrors);
        }
        lineNumber++;
      });

      rl.on('close', () => {
        resolve({ errors });
      });

      rl.on('error', (error) => {
        reject(error);
      });
    });
  }

  private validateLine(line: string, lineNumber: number): string[] {
    const errors: string[] = [];

    if (line.length !== 86) {
      errors.push(
        `Linha ${lineNumber}: Tamanho incorreto (${line.length} caracteres, deveria ser 86).`,
      );
    }

    const tipo = line[0];
    if (!['1', '2', '3', '4'].includes(tipo)) {
      errors.push(`Linha ${lineNumber}: Tipo inválido (${tipo}).`);
    }

    const data = line.substring(1, 26);
    if (
      !/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})([-+]\d{2}:\d{2})$/.test(
        data,
      )
    ) {
      errors.push(`Linha ${lineNumber}: Data inválida (${data}).`);
    }

    const valor = line.substring(56, 66);
    if (!/^\d{1,10}$/.test(valor)) {
      errors.push(`Linha ${lineNumber}: Valor inválido (${valor}).`);
    }

    const vendedor = line.substring(66, 86);
    if (vendedor.length > 20) {
      errors.push(
        `Linha ${lineNumber}: Vendedor com tamanho incorreto (${vendedor.length} caracteres, deveria ser no máximo 20).`,
      );
    }

    return errors;
  }

  private async processFile(
    fileStream: Readable,
    transaction: Transaction,
  ): Promise<void> {
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const processedDataList: ProcessedData[] = [];

    for await (const line of rl) {
      const transactionTypeId = parseInt(line.charAt(0), 10);
      const date = new Date(line.substring(1, 26));
      const product = line.substring(26, 56).trim();
      const value = parseInt(line.substring(56, 66), 10);
      const seller = line.substring(66, 86).trim();

      const processedData = new ProcessedData();
      processedData.transactionTypeId = transactionTypeId;
      processedData.data = date;
      processedData.produto = product;
      processedData.valor = value;
      processedData.vendedor = seller;
      processedData.transactionId = transaction.id;

      processedDataList.push(processedData);
    }

    // Salvar os dados processados no banco de dados
    for (const processedData of processedDataList) {
      await this.transactionService.saveProcessedData(processedData);
    }
  }
}
