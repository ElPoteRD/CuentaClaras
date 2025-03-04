import { AccountEntity } from "./account";
import { UserEntity } from "./user";

export interface GoalEntity {
  id: number;
  name: string;
  description: string;
  targetAmount: number;
  currentType: string;
  startDate: Date;
  targetDate: Date;
  status: string;
  userId: number;
  accountId: number;
  account?: AccountEntity[];
  user?: UserEntity[];
}
