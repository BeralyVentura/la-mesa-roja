import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '../entitites/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail(
    {},
    { message: 'El correo electrónico debe tener un formato válido' },
  )
  email?: string;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  name?: string;

  @IsOptional()
  @IsEnum(UserRole, {
    message: 'El rol debe ser uno de: admin, cook, waiter, customer',
  })
  role?: UserRole;

  @IsOptional()
  @IsBoolean({ message: 'El campo isActive debe ser un valor booleano' })
  isActive?: boolean;
}
