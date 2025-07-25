import { IsNumber, IsOptional, IsString, IsEnum, Min, Max } from 'class-validator';
import { EstadoCocina } from '../enums/estado-cocina.enum';

export class CrearNotificacionCocinaDto {
  @IsNumber()
  ordenId: number;

  @IsOptional()
  @IsNumber()
  cocineroAsignadoId?: number;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  tiempoEstimadoMinutos?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(3)
  prioridad?: number;
}