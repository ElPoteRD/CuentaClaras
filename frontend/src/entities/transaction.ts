import { AccountEntity } from "./account";
import { UserEntity } from "./user";
import { CategoryEntity } from "./category";

export interface TransactionEntity {
    id: number
    amount: number
    description: string
    date: Date
    type: string
    userId: number
    Account?: AccountEntity
    user?: UserEntity;
    Category?: CategoryEntity

}
