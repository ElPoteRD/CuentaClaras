import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiResponse } from '@nestjs/swagger';
import { UpdatePasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({ status: 200, description: 'Return a list of users' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getUsers() {
    return await this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiResponse({ status: 200, description: 'Return a specific user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserId(id);
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  @ApiResponse({ status: 200, description: 'Return a update user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async patchUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    return await this.userService.updateUser(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('new-password/:id')
  @ApiResponse({ status: 200, description: 'Return a update user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async patchPasswordUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePasswordDto,
  ) {
    return await this.userService.updatePassword(id, data);
  }
}
