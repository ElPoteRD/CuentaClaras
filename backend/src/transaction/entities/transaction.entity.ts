import { TransactionType } from '@prisma/client';
import { AccountEntity } from 'src/account/entities/account.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { UserEntity } from 'src/users/entities/user';

export class TransactionEntity {
  id: number;
  amount: number;
  description: string;
  date: Date;
  type: TransactionType;
  userId: number;
  accountId: number;
  categoryId: number;;
  Account?: AccountEntity[];
  user?: UserEntity[];
  Category?: CategoryEntity[];
}
