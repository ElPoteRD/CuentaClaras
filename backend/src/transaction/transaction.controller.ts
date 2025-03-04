import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @UseGuards(JwtAuthGuard)
  @Post('/createTransaction')
  @ApiOperation({ summary: 'Create a new transaction and update balance' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'transaction created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  async createTransaction(@Body() data: CreateTransactionDto) {
    return await this.transactionService.createTransaction(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All transactions found' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No transactions found',
  })
  async getAllTransactions() {
    return await this.transactionService.getAllTransactions();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiOperation({ summary: 'Get transaction by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Transaction found' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found',
  })
  async getTransactionById(@Param('id', ParseIntPipe) id: number) {
    return await this.transactionService.getTransactionById(id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update transaction by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Transaction updated' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found',
  })
  async updateTransaction(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return await this.transactionService.updateTransaction(
      id,
      updateTransactionDto,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete transaction by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Transaction deleted' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found',
  })
  async removeTransaction(@Param('id', ParseIntPipe) id: number) {
    return await this.transactionService.removeTransaction(id);
  }
}
