// src/transaction/transaction.controller.ts

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RequestWithUser } from '../auth/requestWithUser.interface';
import { ProcessedData } from '../models/processed-data.entity';
import { Transaction } from '../models/transaction.entity';
import { TransactionProcessorService } from './transaction-processor.service';
import { TransactionService } from './transaction.service';

@Controller('transaction')
@UseGuards(JwtAuthGuard)
@ApiTags('Transactions')
export class TransactionController {
  constructor(
    private transactionService: TransactionService,
    private transactionProcessorService: TransactionProcessorService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a transaction file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Transaction file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    if (!file) {
      throw new BadRequestException('File not uploaded');
    }
    const userId = req.user.id;
    const transaction =
      await this.transactionService.createTransactionWithStatusReceived(
        file,
        userId,
      );

    this.transactionProcessorService.processTransactionFile(transaction);
  }

  @Get()
  @ApiOperation({ summary: 'List all transactions' })
  async findAll(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  async findOne(@Param('id') id: number): Promise<Transaction> {
    return this.transactionService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.transactionService.remove(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update the status of a transaction' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  async updateStatus(
    @Param('id') id: number,
    @Body('status') status: string,
  ): Promise<Transaction> {
    return this.transactionService.updateStatus(id, status);
  }

  @Get(':transactionId/processed-data')
  @ApiOperation({ summary: 'Get processed data by transaction ID' })
  @ApiParam({ name: 'transactionId', description: 'Transaction ID' })
  async getProcessedData(
    @Param('transactionId') transactionId: number,
  ): Promise<ProcessedData[]> {
    return await this.transactionService.findProcessedDataByTransactionId(
      transactionId,
    );
  }
}
