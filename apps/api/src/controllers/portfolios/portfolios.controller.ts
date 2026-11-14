import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { PortfoliosService } from '../../services/portfolios.service';
import * as val from './validation';

// Errors thrown by the service (e.g. BadRequestException) are turned into
// HTTP error responses by Nest, so the controller does not catch them.
@Controller('portfolios')
export class PortfoliosController {
    constructor(private readonly portfoliosService: PortfoliosService) { }
    @Post()
    async createOnePortfolio(@Body() payload: val.CreatePortfolioPayload): Promise<object> {
        return this.portfoliosService.createPortfolio(payload.input);
    }
    @Get()
    async getPortfolios(): Promise<object> {
        return this.portfoliosService.getPortfolios();
    }
    @Get('/:id')
    async getPortfolioById(@Param('id') id: string): Promise<object> {
        return this.portfoliosService.getPortfolioById(id);
    }
    @Delete('/:id')
    async deletePortfolioById(@Param('id') id: string): Promise<object> {
        return this.portfoliosService.deletePortfolioById(id);
    }
}
