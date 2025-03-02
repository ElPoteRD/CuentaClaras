import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(10)
  name: string;
}
