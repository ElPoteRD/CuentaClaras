import { ApiProperty } from '@nestjs/swagger';
import { AccountType, CurrencyType } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    description: 'The name of the account',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
  @ApiProperty({
    description: 'The type of the account',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  type: AccountType;
  @ApiProperty({
    description: 'The initial balance of the account',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  initialBalance: number;
  @ApiProperty({
    description: 'The currency of the account',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  currency: CurrencyType;
  @ApiProperty({
    description: 'The user id of the account',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

export class DeleteAccountDto {
  @ApiProperty({
    description: 'The id of the account',
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  accountId: number;

  @ApiProperty({
    description: 'User password for verification',
    example: "tuPassword123"
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}