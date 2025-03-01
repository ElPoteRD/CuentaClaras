import { AccountType, CurrencyType } from '@prisma/client';

import { UserEntity } from 'src/users/entities/user';

export class AccountEntity {
  id: number;
  name: string;
  type: AccountType;
  initialBalance: number;
  currency: CurrencyType;
  creationDate: Date;
  userId: number;
  user?: UserEntity;
}
