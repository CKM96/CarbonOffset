import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async insertUser(user: Omit<Users, 'id'>) {
    const insertResult = await this.usersRepository.insert(user);
    return insertResult.identifiers[0].id;
  }

  async findUser(email: string): Promise<Users> {
    return await this.usersRepository.findOneBy({ email });
  }
}
