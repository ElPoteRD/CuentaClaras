import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOpinionDto {
  @ApiProperty({
    description: 'The opinion of the user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  opinion: string;
  @ApiProperty({
    description: 'The rating of the user',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  rating: number;
  @ApiProperty({
    description: 'The user id of the opinion',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
