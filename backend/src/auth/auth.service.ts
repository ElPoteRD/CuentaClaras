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
   * * This function validete the email and password
   * @param dataAuth
   */
  async validateUser(dataAuth: AuthDto) {
    //validate email
    if (!dataAuth.email) throw new UnauthorizedException();
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
  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      user,
      access_token: this.jwt.sign(payload),
    };
  }
}
