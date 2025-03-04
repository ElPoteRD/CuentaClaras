import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateOpinionDto {
  @ApiProperty({
    description: 'Updated opinion of the user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  opinion: string;
  @ApiProperty({
    description: 'Updated rating of the user',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  rating: number;
}
