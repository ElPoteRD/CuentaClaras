import { AccountEntity } from 'src/account/entities/account.entity';

export class UserEntity {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  registrationDate: Date;
  avatar?: string;
  Accounts?: AccountEntity[];

}
