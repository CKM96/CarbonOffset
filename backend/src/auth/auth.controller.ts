import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Request,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccountDto } from '../account/account.dto';

const EMAIL_ALREADY_REGISTERED_ERROR_MESSAGE =
  'duplicate key value violates unique constraint "account_email_key"';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request) {
    return this.authService.login(request.user);
  }

  @Post('register')
  async register(@Body() accountDto: AccountDto) {
    try {
      return await this.authService.registerAccount(accountDto);
    } catch (e) {
      if (e.message === EMAIL_ALREADY_REGISTERED_ERROR_MESSAGE) {
        throw new HttpException(
          'Email already registered',
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
