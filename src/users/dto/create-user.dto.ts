import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../entitites/user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsEnum(UserRole, {
    message: 'El rol debe ser uno de: admin, cook, waiter, customer',
  })
  @IsOptional()
  role?: UserRole;
}
