import { UserEntity } from './user'
import { CategoryEntity } from './category'

export interface BudgetEntity {
    id: number
    name: string
    amount: number
    startDate: Date
    endDate?: Date
    user?: UserEntity[]
    categories?: CategoryEntity[]
}
