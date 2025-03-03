import { UserEntity } from "./user";

export interface OpinionEntity {
  id: number;
  opinion: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  user: UserEntity[];
}
