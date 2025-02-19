export class UserEntity {
    id: number;
    firstName?: string;
    lastName?: string;
    email: string;
    password?: string;
    registrationDate: Date;
    avatar?: string;
}
