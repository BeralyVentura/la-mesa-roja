import { PartialType } from '@nestjs/mapped-types';
import { CreatePlatilloDto } from './create-platillo.dto';
import { IsString, IsNumber, IsBoolean, IsOptional, IsUrl, MinLength, Min } from 'class-validator';

export class UpdatePlatilloDto extends PartialType(CreatePlatilloDto) {
  @IsOptional()
  @IsString()
  @MinLength(2)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  precioBase?: number;

  @IsOptional()
  @IsString()
  @MinLength(2)
  categoria?: string;

  @IsOptional()
  @IsBoolean()
  disponible?: boolean;

  @IsOptional()
  @IsString()
  @IsUrl()
  imagenUrl?: string;
}