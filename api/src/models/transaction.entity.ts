import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Arquivo } from './arquivo.entity';
import { ProcessedData } from './processed-data.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'data_update' })
  dataUpdate: Date;

  @Column({ name: 'status' })
  status: string;

  @OneToMany(() => ProcessedData, (processedData) => processedData.transaction)
  processedData: ProcessedData[];

  @Column({ name: 'errors', type: 'json', nullable: true })
  errors: string[] | null;

  @ManyToOne(() => Arquivo)
  @JoinColumn({ name: 'arquivo_id' })
  arquivo: Arquivo;

  @Column({ name: 'arquivo_id' })
  arquivoId: number;
}
