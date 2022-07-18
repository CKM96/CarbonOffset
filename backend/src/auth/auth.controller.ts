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
import { UserDto } from '../users/user.dto';

const USER_ALREADY_REGISTERED_ERROR_MESSAGE =
  'duplicate key value violates unique constraint "users_email_key"';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request) {
    return this.authService.login(request.user);
  }

  @Post('register')
  async register(@Body() userDto: UserDto) {
    try {
      return await this.authService.registerUser(userDto);
    } catch (e) {
      if (e.message === USER_ALREADY_REGISTERED_ERROR_MESSAGE) {
        throw new HttpException("User already registered", HttpStatus.CONFLICT);
      } else {
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
