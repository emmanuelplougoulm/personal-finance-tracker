import { Injectable } from '@nestjs/common';
import Transaction from '../models/transaction';
import { ITransaction } from '../types/index';
import { randomUUID } from 'node:crypto';

@Injectable()
export class TransactionService {
    async createOneTransaction(transactionData: ITransaction): Promise<object> {
        // This is not relevant, figure out how to check for existing transaction
        // const existingTransaction = await Transaction.findOne({ transactionId })
        // if (existingTransaction) throw new BadRequestException('Transaction already exists')

        const transactionId = randomUUID();
        transactionData.transactionId = transactionId
        const newTransaction = await new Transaction(transactionData).save();

        return { result: { transactionId: newTransaction['transactionId'] } }
    }
    async getOnePortfolioTransactions(portfolioId: string): Promise<object> {
        const transactions = await Transaction.find({ portfolioId });
        return { result: { transactions } }
    }
}