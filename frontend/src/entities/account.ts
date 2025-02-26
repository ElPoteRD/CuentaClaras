import { TransactionEntity } from "./transaction";
import { UserEntity } from "./user";
export interface AccountEntity {
  id: number;
  name: string;
  balance: number;
  userId: number;
  user?: UserEntity[];
  Transactions?: TransactionEntity[];
}
