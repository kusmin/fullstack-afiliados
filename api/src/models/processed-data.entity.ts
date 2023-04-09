// src/processed-data/processed-data.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionType } from './transaction-type.entity';
import { Transaction } from './transaction.entity';

@Entity('processed_data')
export class ProcessedData {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @ManyToOne(() => TransactionType)
  @JoinColumn({ name: 'transaction_type_id' })
  transactionType: TransactionType;

  @Column({ name: 'transaction_type_id' })
  transactionTypeId: number;

  @Column({ type: 'timestamp' })
  data: Date;

  @Column()
  produto: string;

  @Column()
  valor: number;

  @Column()
  vendedor: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.processedData, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @Column({ name: 'transaction_id' })
  transactionId: number;
}
