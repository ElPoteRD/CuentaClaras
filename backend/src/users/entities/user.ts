import { AccountEntity } from 'src/account/entities/account.entity';
import { GoalEntity } from 'src/goals/entities/goal.entity';
import { OpinionEntity } from 'src/opinions/entities/opinion.entity';
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
  Goals?: GoalEntity[];
  Opinions?: OpinionEntity[];
}
