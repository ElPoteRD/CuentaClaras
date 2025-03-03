import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccountDto, DeleteAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { AccountEntity } from './entities/account.entity';
import { TransactionType } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}
  /**
   ** Get all accounts
   *
   */
  async getAllAccount(): Promise<AccountEntity[]> {
    try {
      const accounts = await this.prisma.account.findMany({});
      return accounts;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
  /**
   ** Get account by Id
   * @param id
   */
  async getAccountById(id: number): Promise<AccountEntity> {
    try {
      const account = await this.prisma.account.findFirst({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              registrationDate: true,
            },
          },
          transactions: {
            select: {
              id: true,
              amount: true,
              type: true,
              date: true,
            },
          },
        },
      });
      if (!account) {
        throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
      }
      return account;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          // Check if the account was found
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
  /**
   ** Create a new account
   *
   */
  async createAccount(account: CreateAccountDto): Promise<AccountEntity> {
    try {
      const newAccount = await this.prisma.account.create({
        data: {
          name: account.name,
          type: account.type,
          initialBalance: account.initialBalance,
          currency: account.currency,
          userId: account.userId,
        },
        include: {
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
      return newAccount;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async updateAccountBalance(
    accountId: number,
    amount: number,
    type: TransactionType,
  ) {
    try {
      const account = await this.prisma.account.findUnique({
        where: { id: accountId },
      });

      if (!account) {
        throw new HttpException('Cuenta no encontrada', HttpStatus.NOT_FOUND);
      }

      // Calcular el nuevo balance
      const newinitialBalance =
        type === TransactionType.Ingreso
          ? account.initialBalance + amount
          : account.initialBalance - amount;

      // Actualizar la cuenta
      const updatedAccount = await this.prisma.account.update({
        where: { id: accountId },
        data: { initialBalance: newinitialBalance },
      });
      return updatedAccount;
    } catch (error) {
      throw new HttpException(
        `Error al actualizar el balance: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   ** Update account by Id
   * @param id
   */
  async updateAccount(id: number, updateAccountDto: UpdateAccountDto) {
    try {
      const updatedAccount = await this.prisma.account.update({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              registrationDate: true,
            },
          },
          transactions: {
            select: {
              id: true,
              amount: true,
              type: true,
              date: true,
            },
          },
        },
        data: updateAccountDto,
      });
      if (!updatedAccount) {
        throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
      }
      return updatedAccount;
    } catch (error) {
      throw new HttpException(
        `Failed to update account: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   ** Delete account by userId
   * @param userId
   */
   async deleteAccount(accountId: number, userId: number) {
    try {
      // Verificar que la cuenta existe y pertenece al usuario
      const account = await this.prisma.account.findFirst({
        where: {
          id: accountId,
          userId: userId,
        },
      });
  
      if (!account) {
        throw new HttpException(
          'Cuenta no encontrada o no autorizada',
          HttpStatus.NOT_FOUND,
        );
      }
  
      // Eliminar usando transacción para mantener integridad
      return await this.prisma.$transaction(async (prisma) => {
        // Eliminar metas asociadas
        await prisma.goal.deleteMany({
          where: { accountId: accountId },
        });
  
        // Eliminar transacciones asociadas
        await prisma.transaction.deleteMany({
          where: { accountId: accountId },
        });
  
        // Eliminar la cuenta
        return await prisma.account.delete({
          where: { id: accountId },
        });
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error al eliminar la cuenta: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
