import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from '../aws/aws.module';
import { ProcessedData } from '../models/processed-data.entity';
import { TransactionType } from '../models/transaction-type.entity';
import { Transaction } from '../models/transaction.entity';
import { TransactionProcessorService } from './transaction-processor.service';
import { TransactionTypeService } from './transaction-type.service';
import { TransactionConsumer } from './transaction.consumer';
import { TransactionController } from './transaction.controller';
import { TransactionProducer } from './transaction.producer';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionType, ProcessedData]),
    AwsModule,
    BullModule.registerQueue({
      name: 'transaction',
    }),
  ],
  providers: [
    TransactionService,
    TransactionTypeService,
    TransactionProducer,
    TransactionConsumer,
    TransactionProcessorService,
  ],
  controllers: [TransactionController],
  exports: [TransactionService, TransactionTypeService, TransactionProducer],
})
export class TransactionModule {}
