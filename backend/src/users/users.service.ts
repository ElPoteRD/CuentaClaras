import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { UserEntity } from './entities/user';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers(): Promise<UserEntity[] | []> {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          password: false,
          registrationDate: true,
          avatar: true,
        },
      });
      return users;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async getUserId(id: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id,
        },
      });
      if (!user) throw new NotFoundException();
      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(`The user with id ${id} is not found`);
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  /**
   * * This function create a user using an id params
   * @param userData
   */
  async createUsers(userData: CreateUserDto): Promise<UserEntity> {
    try {
      const existingUser = await this.getUserByEmail(userData.email);
      //Check if the user already exists
      if (existingUser) throw new ConflictException();
      //Encrypt password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      //Create user
      const newUser = await this.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });
      return newUser;
    } catch (error) {
      if (error instanceof ConflictException)
        throw new ConflictException(
          `The Gmail ${userData.email} is currently in use`,
        );
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async getUserByEmail(email: string): Promise<UserEntity | undefined> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email },
      });
      return user;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  /**
   * * This function update a user using an id params
   * @param id
   * @param dataUser
   */
  async updateUser(id: number, dataUser: UpdateUserDto): Promise<UserEntity> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        throw new NotFoundException(`Usuario no encontrado con id ${id}`);
      }
      return await this.prisma.user.update({
        where: { id },
        data: {
          firstName: dataUser.firstName,
          lastName: dataUser.lastName,
          email: dataUser.email,
          avatar: dataUser.avatar
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          registrationDate: true,
          avatar: true
        }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al actualizar el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * * This function update the password of a user
   * @param id
   * @param dataUser
   */
  async updatePassword(
    id: number,
    dataUser: UpdatePasswordDto,
  ): Promise<UserEntity> {
    try {
      //Encrypt new password
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(dataUser.password, salt);
      //Update passowrd
      const updateUser = await this.prisma.user.update({
        data: {
          password: hash,
        },
        where: {
          id,
        },
      });
      return updateUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new NotFoundException(`The user with id ${id} is not found`);
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
