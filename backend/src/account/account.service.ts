import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async insertAccount(Account: Omit<Account, 'id'>) {
    const insertResult = await this.accountRepository.insert(Account);
    return insertResult.identifiers[0].id;
  }

  async findAccount(email: string): Promise<Account> {
    return await this.accountRepository.findOneBy({ email });
  }
}
