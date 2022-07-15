import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';
import { Users } from './users.entity';
import { hash } from 'bcrypt';

export const USER_ALREADY_REGISTERED = 'User already registered';
const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async createUser(userDto: UserDto) {
    const { email, password } = userDto;
    if (await this.findUser(email)) {
      throw Error(USER_ALREADY_REGISTERED);
    }
    hash(password, SALT_ROUNDS, async (error, hash) => {
      if (error) {
        console.error(error);
      } else {
        await this.usersRepository.insert({
          email,
          password_hash: hash,
        });
      }
    });
  }

  private async findUser(email: string): Promise<Users> {
    return await this.usersRepository.findOneBy({ email });
  }
}
