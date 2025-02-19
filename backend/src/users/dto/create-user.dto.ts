import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The first name of the User',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @ApiProperty({
    description: 'The last name of the User',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @ApiProperty({
    description: 'The email of the User',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  email: string;
  @ApiProperty({
    description: 'The password of the User',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
  @ApiProperty({
    description: 'The avatar of the User',
    type: String,
  })
  @IsString()
  @MaxLength(255)
  avatar: string;
}
