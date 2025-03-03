import { TransactionEntity } from "./transaction";
import { UserEntity } from "./user";
export interface AccountEntity {
  id: number;
  name: string;
  type: "banco" | "crédito" | "dinero" | "inversión";
  initialBalance: number;
  currency: string;
  creationDate: Date;
  userId: number;
  Transactions?: TransactionEntity[];
  user?: UserEntity;
}
export interface AccountRequest {
  id: number;
  userId: number;
}
