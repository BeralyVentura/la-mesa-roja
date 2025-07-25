import { IsEnum, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { EstadoCocina } from '../enums/estado-cocina.enum';

export class ActualizarEstadoCocinaDto {
  @IsEnum(EstadoCocina)
  estado: EstadoCocina;

  @IsOptional()
  @IsNumber()
  cocineroAsignadoId?: number;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  tiempoEstimadoMinutos?: number;
}
