import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/database/prisma.service';
import { TransactionEntity } from './entities/transaction.entity';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    private accout: AccountService,
  ) {}
  async createTransaction(
    dataTransaction: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    try {
      const newTransaction = await this.prisma.transaction.create({
        data: {
          amount: dataTransaction.amount,
          description: dataTransaction.description,
          type: dataTransaction.type,
          userId: dataTransaction.userId,
          accountId: dataTransaction.accountId,
          categoryId: dataTransaction.categoryId,
        },
      });
      await this.accout.updateAccountBalance(
        dataTransaction.accountId,
        dataTransaction.amount,
        dataTransaction.type,
      );
      return newTransaction;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new NotFoundException(error.message);
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async getAllTransactions() {
    try {
      const transactions = await this.prisma.transaction.findMany({});
      return transactions;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async getTransactionById(id: number) {
    try {
      const transaction = await this.prisma.transaction.findFirst({
        where: { id },
        include: {
          account: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              registrationDate: true,
            },
          },
        },
      });
      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }
      return transaction;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async updateTransaction(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    try {
      const updateTransaction = await this.prisma.transaction.update({
        where: { id },
        data: {
          amount: updateTransactionDto.amount,
          description: updateTransactionDto.description,
          type: updateTransactionDto.type,
          categoryId: updateTransactionDto.categoryId,
        },
      });
      if (!updateTransaction) {
        throw new NotFoundException('Transaction not found');
      }
      return updateTransaction;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new NotFoundException(error.message);
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async removeTransaction(id: number) {
    try {
      const deleteTransaction = await this.prisma.transaction.delete({
        where: {
          id,
        },
        include: { account: true },
      });

      if (!deleteTransaction) {
        throw new NotFoundException('Transaction not found');
      }

      // Si es un ingreso, restamos el monto (negativo)
      // Si es un gasto, sumamos el monto (positivo)
      const adjustedAmount =
        deleteTransaction.type === 'Ingreso'
          ? -deleteTransaction.amount
          : deleteTransaction.type === 'Gasto'
            ? +deleteTransaction.amount
            : deleteTransaction.amount;

      await this.accout.updateAccountBalance(
        deleteTransaction.accountId,
        adjustedAmount,
        deleteTransaction.type,
      );

      return deleteTransaction;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
