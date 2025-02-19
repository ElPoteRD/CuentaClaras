import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/entities/user';

@Injectable()
export class AuthService {
  constructor(
    private userServices: UsersService,
    private jwt: JwtService,
  ) {}

  /**
   * * This function validete the username and password
   * @param dataAuth
   */
  async validateUser(dataAuth: AuthDto) {
    //validate username
    const user = await this.userServices.getUserByEmail(dataAuth.email);
    if (!user) throw new UnauthorizedException();
    //Match
    const isMatch = await bcrypt.compare(dataAuth.password, user.password);
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    } else throw new UnauthorizedException();
  }

  /**
   * * This function generate a new JWT
   * @param user
   */
  async login(user: UserEntity) {
    const payload = { email: user.email, sub: user.id };
    return {
      user,
      access_token: this.jwt.sign(payload),
    };
  }
}
