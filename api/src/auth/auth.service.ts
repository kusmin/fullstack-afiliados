import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.entity';
import { CreateUserDto } from '../user/user.dto';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    const user = await this.userService.findOneByEmail(email);

    if (user && (await bcrypt.compare(password, user.hashPassword))) {
      return user;
    }

    return null;
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = this.userService.findOne(payload.id);

    if (user) {
      return user;
    }

    return null;
  }

  async login(user: any) {
    const payload: JwtPayload = { id: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
