import { Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { compareSync, hashSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AccountDto } from '../account/account.dto';
import { Account } from 'src/account/account.entity';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async registerAccount(accountDto: AccountDto) {
    const { email, password } = accountDto;
    const hashedPassword = hashSync(password, SALT_ROUNDS);
    const generatedAccountId = await this.accountService.insertAccount({
      email,
      password_hash: hashedPassword,
    });
    return await this.login({ email, id: generatedAccountId });
  }

  async validateAccount(email: string, password: string): Promise<any> {
    const account = await this.accountService.findAccount(email);
    if (account && compareSync(password, account.password_hash)) {
      const { password_hash, ...result } = account;
      return result;
    }
    return null;
  }

  async login(account: Omit<Account, 'password_hash'>) {
    const payload = { username: account.email, sub: account.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
