// src/transaction/transaction.consumer.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Transaction } from '../models/transaction.entity';
import { TransactionProcessorService } from './transaction-processor.service';

@Processor('transaction')
export class TransactionConsumer {
  constructor(
    private readonly transactionProcessorService: TransactionProcessorService,
  ) {}

  @Process('process')
  async processTransaction(job: Job<Transaction>): Promise<void> {
    await this.transactionProcessorService.processTransactionFile(job.data);
  }
}
