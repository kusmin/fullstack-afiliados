import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Arquivo } from './models/arquivo.entity';
import { ProcessedData } from './models/processed-data.entity';
import { TransactionType } from './models/transaction-type.entity';
import { Transaction } from './models/transaction.entity';
import { User } from './models/user.entity';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: (process.env.TYPEORM_CONNECTION as any) || 'postgres',
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
      logging: process.env.TYPEORM_LOGGING === 'true',
      entities: [User, Arquivo, TransactionType, Transaction, ProcessedData],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
