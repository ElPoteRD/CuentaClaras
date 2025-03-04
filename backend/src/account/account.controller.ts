import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto, DeleteAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/createAccount')
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({ status: 201, description: 'Account created' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, Log in to create an account',
  })
  async createAccount(@Body() data: CreateAccountDto) {
    return await this.accountService.createAccount(data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Alls Account found' })
  @ApiResponse({ status: 200, description: 'Alls Account found' })
  @Get()
  async getAllAccount() {
    return await this.accountService.getAllAccount();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiOperation({ summary: 'Get account by id' })
  @ApiResponse({ status: 200, description: 'Account found' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async getAccountById(@Param('id', ParseIntPipe) id: number) {
    return await this.accountService.getAccountById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  @ApiOperation({ summary: 'Update account by id' })
  @ApiResponse({ status: 200, description: 'Account updated' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async updateAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAccountDto,
  ) {
    return await this.accountService.updateAccount(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/deleteAccount')
  @ApiOperation({
    summary: 'Delete an account with password verification',
  })
  @ApiResponse({ status: 200, description: 'Successfully deleted account' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or incorrect password',
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async deleteAccount(@Body() data: DeleteAccountDto, @Req() req) {
    return await this.accountService.deleteAccount(
      data.accountId,
      req.user.userId,
    );
  }
}
