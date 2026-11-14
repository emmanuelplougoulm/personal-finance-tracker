import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ITransferPayload } from '../../types';

export class CreatePortfolioInput {
  @IsString()
  @IsNotEmpty()
  portfolioName: string;

  @IsOptional()
  @IsString()
  timeCreated?: string;

  @IsOptional()
  @IsString()
  timeUpdated?: string;

  @IsOptional()
  @IsArray()
  assets?: object[];
}

export class CreatePortfolioPayload implements ITransferPayload {
  @IsObject()
  @ValidateNested()
  @Type(() => CreatePortfolioInput)
  input: CreatePortfolioInput;
}
