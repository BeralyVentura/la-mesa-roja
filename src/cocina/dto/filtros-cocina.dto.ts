import { IsOptional, IsEnum, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { EstadoCocina } from '../enums/estado-cocina.enum';

export class FiltrosCocinaDto {
  @IsOptional()
  @IsEnum(EstadoCocina)
  estado?: EstadoCocina;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  cocineroId?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  prioridad?: number;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  mesa?: number;
}