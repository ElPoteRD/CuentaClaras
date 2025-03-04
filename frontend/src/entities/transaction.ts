import { AccountEntity } from "./account";
import { UserEntity } from "./user";
import { CategoryEntity } from "./category";


export interface TransactionEntity {
  id: number;
  amount: number;
  description: string;
  date: Date;
  type: "Ingreso" | "Gasto";
  userId: number;
  accountId: number;
  categoryId: number;
  Account?: AccountEntity[];
  user?: UserEntity[];
  Category?: CategoryEntity[];
}

export interface updateTransaction {
  amount: number;
  description: string;
  type: string;
  categoryId: number;
}
