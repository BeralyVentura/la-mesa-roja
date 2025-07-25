import { IsString, IsNumber, IsBoolean, IsOptional, IsUrl, MinLength, Min } from 'class-validator';

export class CreatePlatilloDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre: string;

  @IsString()
  @MinLength(5, { message: 'La descripción debe tener al menos 5 caracteres' })
  descripcion: string;

  @IsNumber({}, { message: 'El precio base debe ser un número' })
  @Min(0.01, { message: 'El precio base debe ser mayor a 0' })
  precioBase: number;

  @IsString()
  @MinLength(2, { message: 'La categoría debe tener al menos 2 caracteres' })
  categoria: string;

  @IsOptional()
  @IsBoolean({ message: 'Disponible debe ser true o false' })
  disponible?: boolean;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'La URL de la imagen debe ser válida' })
  imagenUrl?: string;
}