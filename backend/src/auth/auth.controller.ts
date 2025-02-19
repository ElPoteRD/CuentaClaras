import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiResponse } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authServices: AuthService, private userServices: UsersService){}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    @ApiResponse({status: 200, description: 'Generate a access_token'})
    @ApiResponse({status: 401, description: 'Unauthorizated'})
    async login(@Request() req){
     return this.authServices.login(req.user)
    }

    @ApiResponse({status: 200, description: 'Return a new user'})
    @ApiResponse({status: 409, description: 'The username is in use'})
    @ApiResponse({status: 500, description: 'Internal Server Error'})
    @Post('/register')
    async register(@Body() data: CreateUserDto){
        return await this.userServices.createUsers(data)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    @ApiResponse({status: 200, description: 'Return a user profile'})
    @ApiResponse({status: 500, description: 'Internal Server Error'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    async getProfile(@Request() req){
        return await this.userServices.getUserId(req.user.userId)
    }
}
