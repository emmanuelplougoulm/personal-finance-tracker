import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsObject, IsOptional, IsPositive, IsString, Min, ValidateNested } from 'class-validator';
import { TRANSACTION_TYPE } from '../../constants';
import { ITransferPayload } from '../../types';

export class CreateTransactionInput {
  @IsIn(Object.values(TRANSACTION_TYPE))
  type: string;

  @IsString()
  @IsNotEmpty()
  portfolioId: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsString()
  @IsNotEmpty()
  asset: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fees?: number;
}

export class CreateTransactionPayload implements ITransferPayload {
  @IsObject()
  @ValidateNested()
  @Type(() => CreateTransactionInput)
  input: CreateTransactionInput;
}
