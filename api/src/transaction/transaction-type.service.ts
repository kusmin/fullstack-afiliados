import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionType } from '../models/transaction-type.entity';

@Injectable()
export class TransactionTypeService {
  constructor(
    @InjectRepository(TransactionType)
    private readonly transactionTypeRepository: Repository<TransactionType>,
  ) {}

  async seedTransactionTypes() {
    const transactionTypes = [
      { description: 'Venda produtor', nature: 'Entrada', sign: '+' },
      { description: 'Venda afiliado', nature: 'Entrada', sign: '+' },
      { description: 'Comissão paga', nature: 'Saída', sign: '-' },
      { description: 'Comissão recebida', nature: 'Entrada', sign: '+' },
    ];

    for (const transactionType of transactionTypes) {
      const existingTransactionType = await this.findOneByDescricao(
        transactionType.description,
      );

      if (!existingTransactionType) {
        await this.create(transactionType);
      }
    }
  }

  async findOneByDescricao(description: string): Promise<TransactionType> {
    return await this.transactionTypeRepository.findOne({
      where: { description },
    });
  }

  async create(
    transactionTypeData: Partial<TransactionType>,
  ): Promise<TransactionType> {
    const transactionType =
      this.transactionTypeRepository.create(transactionTypeData);
    return await this.transactionTypeRepository.save(transactionType);
  }
}
