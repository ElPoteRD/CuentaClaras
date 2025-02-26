import { TransactionEntity } from './transaction';
export interface CategoryEntity {
    id: number;
    name: string;
    Transactions?: TransactionEntity[];
}
