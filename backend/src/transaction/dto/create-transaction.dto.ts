import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import {} from '@prisma/client/runtime/library';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'The amount of the transaction',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'The description of the transaction',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  description: string;
  @ApiProperty({
    description: 'The type of the transaction',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  type: TransactionType;
  @ApiProperty({
    description: 'The user id of the transaction',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'The account id of the transaction',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  accountId: number;
  @ApiProperty({
    description: 'The category id of the transaction',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
