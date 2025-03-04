import { Account, User } from '@prisma/client';

export class GoalEntity {
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
  account: Account[];
  user: User[];
}
