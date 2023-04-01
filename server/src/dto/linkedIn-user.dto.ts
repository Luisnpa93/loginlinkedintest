import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Column } from 'typeorm';

export class LinkedInUserDto {

  @IsNotEmpty()
  linkedinId: string;
  @IsNotEmpty()
  displayName: string;
  @IsEmail()
  linkedinEmail: string;
  @IsNotEmpty()
  photo: string;

}