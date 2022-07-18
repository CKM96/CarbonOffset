import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compareSync, hashSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users/user.dto';
import { Users } from 'src/users/users.entity';

export const USER_ALREADY_REGISTERED = 'User already registered';
const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerUser(userDto: UserDto) {
    const { email, password } = userDto;
    const hashedPassword = hashSync(password, SALT_ROUNDS);
    const generatedUserId = await this.usersService.insertUser({
      email,
      password_hash: hashedPassword,
    });
    return await this.login({ email, id: generatedUserId });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUser(email);
    if (user && compareSync(password, user.password_hash)) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Omit<Users, 'password_hash'>) {
    const payload = { username: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
