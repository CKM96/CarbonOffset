import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserDto } from './user.dto';
import { UsersService, USER_ALREADY_REGISTERED } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() userDto: UserDto) {
    try {
      await this.usersService.createUser(userDto);
      return {};
    } catch (e) {
      if (e.message === USER_ALREADY_REGISTERED) {
        throw new HttpException(USER_ALREADY_REGISTERED, HttpStatus.CONFLICT);
      } else {
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
