// src/transaction/transaction.controller.ts

import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RequestWithUser } from '../auth/requestWithUser.interface';
import { TransactionProcessorService } from './transaction-processor.service';
import { TransactionService } from './transaction.service';

@Controller('transaction')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(
    private transactionService: TransactionService,
    private transactionProcessorService: TransactionProcessorService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    const userId = req.user.id;
    const transaction =
      await this.transactionService.createTransactionWithStatusReceived(
        file,
        userId,
      );

    this.transactionProcessorService.processTransactionFile(transaction);
  }
}
