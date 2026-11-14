import { Type } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';
import { ITransferPayload } from '../../types';


export class CreatePortfolioInput {
  @IsString() @IsNotEmpty()
  portfolioName: string;

  @IsString()
  portfolioId: string;

  @IsString()
  timeCreated: string;

  @IsString()
  timeUpdated: string;

  @IsString()
  assets: object[];
}

export class CreatePortfolioPayload implements ITransferPayload {
  @IsNotEmpty()
  @Type(() => CreatePortfolioInput)
  input: CreatePortfolioInput;
}