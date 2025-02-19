
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserEntity } from 'src/users/entities/user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    try {
      const user = await this.authService.validateUser({email, password});
    if (!user) {
      throw new UnauthorizedException(`Invaild credentials`);
    }
    return user;
    } catch (error) {
      if(error instanceof UnauthorizedException)
        throw new UnauthorizedException(`Invalid credentials`)
      if(error instanceof Error)
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
