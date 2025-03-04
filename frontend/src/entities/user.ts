import { AccountEntity } from "./account";
import { GoalEntity } from "./goals";
import { OpinionEntity } from "./opinion";
import { TransactionEntity } from "./transaction";
export interface UserEntity {
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
