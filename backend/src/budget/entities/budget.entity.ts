import { CategoryEntity } from "src/category/entities/category.entity";
import { UserEntity } from "src/users/entities/user";

export class BudgetEntity {
    id: number;
    name: string;
    amount: number;
    startDate: Date;
    endDate?: Date;
    user?: UserEntity[];
    categories?: CategoryEntity[];
}
