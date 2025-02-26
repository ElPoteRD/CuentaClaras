import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Update first name of the User',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    description: 'Update last name of the User',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    description: 'Update email of the User',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @ApiProperty({
    description: 'Update avatar of the User',
    type: String,
  })
  @IsString()
  @MaxLength(255)
  avatar: string;
}

export class UpdatePasswordDto {
    @ApiProperty({
      description: 'The new password',
      type: String,
      minLength: 8,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
  }