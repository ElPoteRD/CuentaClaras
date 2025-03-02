import { UserEntity } from 'src/users/entities/user';

export class OpinionEntity {
  id: number;
  opinion: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  user: UserEntity[];
}
