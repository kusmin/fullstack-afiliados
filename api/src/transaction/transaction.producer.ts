import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Transaction } from '../models/transaction.entity';

@Injectable()
export class TransactionProducer {
  constructor(
    @InjectQueue('transaction') private readonly transactionQueue: Queue,
  ) {}

  async addToQueue(transaction: Transaction) {
    await this.transactionQueue.add('process', transaction);
  }
}
