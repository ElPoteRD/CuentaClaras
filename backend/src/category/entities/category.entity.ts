import { TransactionEntity } from "src/transaction/entities/transaction.entity";

export class CategoryEntity {
    id: number;
    name: string;
    Transactions?: TransactionEntity[];
}
