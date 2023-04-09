import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 'src/aws/s3.service';
import { Repository } from 'typeorm';
import { ProcessedData } from '../models/processed-data.entity';
import { Transaction } from '../models/transaction.entity';
import { TransactionProducer } from './transaction.producer';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private readonly s3Service: S3Service,
    private readonly transactionProducer: TransactionProducer,
    @InjectRepository(ProcessedData)
    private readonly processedDataRepository: Repository<ProcessedData>,
  ) {}

  async createTransactionWithStatusReceived(
    file: Express.Multer.File,
    id: number,
  ): Promise<Transaction> {
    const transaction = new Transaction();
    transaction.status = 'RECEBIDA';

    transaction.arquivo = await this.s3Service.uploadFile(file, id);
    await this.transactionRepository.save(transaction);
    await this.transactionProducer.addToQueue(transaction);
    return transaction;
  }
  async createTransaction(
    transaction: Partial<Transaction>,
  ): Promise<Transaction> {
    const newTransaction = this.transactionRepository.create(transaction);
    return this.transactionRepository.save(newTransaction);
  }

  async updateTransaction(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepository.save(transaction);
  }

  async saveProcessedData(
    processedData: ProcessedData,
  ): Promise<ProcessedData> {
    return await this.processedDataRepository.save(processedData);
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async findOne(id: number): Promise<Transaction> {
    return this.transactionRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.transactionRepository.delete(id);
  }

  async updateStatus(id: number, status: string): Promise<Transaction> {
    const transaction = await this.findOne(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    transaction.status = status;
    return this.transactionRepository.save(transaction);
  }

  async findProcessedDataByTransactionId(
    transactionId: number,
  ): Promise<ProcessedData[]> {
    return await this.processedDataRepository.find({
      where: { transactionId },
      relations: ['transactionType'],
    });
  }
}
