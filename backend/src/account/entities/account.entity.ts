import { AccountType, CurrencyType } from '@prisma/client';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';

import { UserEntity } from 'src/users/entities/user';

export class AccountEntity {
  id: number;
  name: string;
  type: AccountType;
  initialBalance: number;
  currency: CurrencyType;
  creationDate: Date;
  userId: number;
  Transactions?: TransactionEntity[];
  user?: UserEntity;
}
