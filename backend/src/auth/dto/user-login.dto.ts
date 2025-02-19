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
        description: 'Gmail of account',
        type: String
    })
    @IsString()
    email: string
}