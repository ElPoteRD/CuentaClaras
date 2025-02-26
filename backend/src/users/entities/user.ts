import { AccountEntity } from 'src/account/entities/account.entity';
import { BudgetEntity } from 'src/budget/entities/budget.entity';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';

export class UserEntity {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  registrationDate: Date;
  avatar?: string;
  Budgets?: BudgetEntity[];
  Accounts?: AccountEntity[];
  Transactions?: TransactionEntity[];
}
