import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransactionService } from '../../services/transaction.service';
import * as val from './validation';

@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }
    @Post()
    async createTransaction(@Body() payload: val.CreateTransactionPayload): Promise<object> {
        return this.transactionService.createOneTransaction(payload.input);
    }
    @Get('/:portfolioId')
    async getOnePortfolioTransactions(@Param('portfolioId') portfolioId: string): Promise<object> {
        return this.transactionService.getOnePortfolioTransactions(portfolioId);
    }
}
