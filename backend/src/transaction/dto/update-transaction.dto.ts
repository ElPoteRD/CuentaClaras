import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class UpdateTransactionDto {
  @ApiProperty({
    description: ' Update amount of the transaction',
    type: Number,
  })
  @IsNumber()
  amount: number;
  @ApiProperty({
    description: ' Update description of the transaction',
    type: String,
  })
  @IsString()
  description: string;
  @ApiProperty({
    description: 'Update type of the transaction',
    type: String,
  })
  @IsString()
  type: TransactionType;
  @ApiProperty({
    description: 'Update user id of the transaction',
    type: Number,
  })
  @IsNumber()
  categoryId: number;
}
