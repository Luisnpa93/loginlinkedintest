import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  username: string;
  
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  @MinLength(8) // Require a minimum password length of 8 characters
  password: string;
}
