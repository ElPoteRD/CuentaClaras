import { AccountEntity } from 'src/account/entities/account.entity';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';

export class UserEntity {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  registrationDate: Date;
  avatar?: string;
  Accounts?: AccountEntity[];
  Transactions?: TransactionEntity[];
}
