import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"

export class UserLoginDto{
    @ApiProperty({
        description: 'User id',
        type: Number
    })
    @IsNumber()
    id: number

    @ApiProperty({
        description: 'Email of account',
        type: String
    })
    @IsString()
    email: string
}