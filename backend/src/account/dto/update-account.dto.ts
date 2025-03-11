import { ApiProperty } from '@nestjs/swagger';
import { AccountType, CurrencyType } from '@prisma/client';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateAccountDto {
  @ApiProperty({
    description: 'Update name of the account',
    type: String,
  })
  @IsString()
  name?: string;
  @ApiProperty({
    description: 'The currency of the account',
    type: String,
  })
  @IsString()
  currency?: CurrencyType;
  @ApiProperty({
    description: 'The type of the account',
    type: String,
  })
  @IsString()
  type?: AccountType;
}
