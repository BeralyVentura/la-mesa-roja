import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsBoolean,
  Matches,
} from 'class-validator';
import { UserRole } from '../entitites/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(50, { message: 'La contraseña no puede exceder 50 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
  })
  password?: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  name?: string;

  @IsOptional()
  @IsEnum(UserRole, {
    message: 'El rol debe ser uno de: admin, cocinero, mesero, cliente',
  })
  role?: UserRole;

  @IsOptional()
  @IsBoolean({ message: 'El campo isActive debe ser verdadero o falso' })
  isActive?: boolean;
}