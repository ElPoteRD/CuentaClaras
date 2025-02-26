import { TransactionEntity } from "src/transaction/entities/transaction.entity";
import { UserEntity } from "src/users/entities/user";

export class AccountEntity {
    id: number;
    name: string;
    balance: number;
    userId: number;
    user?: UserEntity;
    Transactions?: TransactionEntity[];
}
