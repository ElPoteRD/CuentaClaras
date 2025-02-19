import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class AuthDto{
    @ApiProperty({
        default: 'Username for login',
        type: String
    })
    @IsString()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        default: 'Password for login',
        type: String
    })
    @IsString()
    @IsNotEmpty()
    password: string
}