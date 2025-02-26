import { BudgetEntity } from "./budget";
import { AccountEntity } from "./account";
import { TransactionEntity } from "./transaction";
export interface UserEntity {
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
