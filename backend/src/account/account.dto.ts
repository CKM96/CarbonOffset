import { IsEmail, IsNotEmpty } from "class-validator";

export class AccountDto {
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  password: string;
}
