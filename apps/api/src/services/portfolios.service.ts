import { Injectable, BadRequestException } from '@nestjs/common';
import Portfolio from '../models/portfolio';
import { randomUUID } from 'node:crypto';
import { IPortfolio } from '../types/index';
import { TransactionService } from "../services/transaction.service";
import { formatTransactionsByAssets } from "../utils/format";


interface AggregatedPortfolio {
    [key: string]: any; // Index signature pour autoriser des clés arbitraires
}


@Injectable()
export class PortfoliosService {
    constructor(private readonly transactionService: TransactionService) { }
    async createPortfolio(portfolioData: IPortfolio): Promise<object> {
        const portfolioName = portfolioData.portfolioName?.trim();
        if (!portfolioName) throw new BadRequestException('Portfolio name is required')

        const existingPortfolio = await Portfolio.findOne({ portfolioName })

        if (existingPortfolio) throw new BadRequestException('Portfolio already exists')

        const portfolioId = randomUUID();
        const newPortfolio = await new Portfolio({
            ...portfolioData,
            portfolioName,
            portfolioId
        }).save();
        return { result: { portfolioId: newPortfolio['portfolioId'] } }
    }
    async getPortfolios(): Promise<object> {
        const allPortfolios = await Portfolio.find();
        return { result: allPortfolios }
    }
    async getPortfolioById(id: string): Promise<object> {
        const portfolio: AggregatedPortfolio | null = await Portfolio.findOne({ portfolioId: id });

        if (portfolio) {
            const transactions: any = await this.transactionService.getOnePortfolioTransactions(id);
            const sortedTransactions = formatTransactionsByAssets(transactions.result.transactions);

            const updatedPortfolio: AggregatedPortfolio = {
                ...portfolio.toObject(),
                assets: sortedTransactions
            }
            return { result: { ...updatedPortfolio } }
        } else {
            return { return: null }
        }
    }
    async deletePortfolioById(id: string): Promise<object> {
        const portfolio = await Portfolio.deleteOne({ portfolioId: id });
        const { deletedCount } = portfolio;

        return { result: { deletedCount } }
    }
}