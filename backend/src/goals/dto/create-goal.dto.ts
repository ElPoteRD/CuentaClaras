import { ApiProperty } from '@nestjs/swagger';
import { CurrencyType, GoalStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateGoalDto {
  @ApiProperty({
    description: 'The name of the goal',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;
  @ApiProperty({
    description: 'The description of the goal',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  description: string;
  @ApiProperty({
    description: 'The description of the goal',
    type: String,
  })
  @IsNumber()
  @IsNotEmpty()
  targetAmount: number;
  @ApiProperty({
    description: 'The type of the goal',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  currentType: CurrencyType;
  @ApiProperty({
    description: 'The target date of the goal',
    type: Date,
  })
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  targetDate: Date;
  @ApiProperty({
    description: 'The status of the goal',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  status: GoalStatus;
  @ApiProperty({
    description: 'The user id of the goal',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
  @ApiProperty({
    description: 'The account id of the goal',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  accountId: number;
}
