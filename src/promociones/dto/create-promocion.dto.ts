import {
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
  Min,
  MinLength,
  Matches,
  IsDate,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum TipoPromocion {
  PORCENTAJE = 'porcentaje',
  CANTIDAD_FIJA = 'cantidad_fija',
  COMBO = 'combo',
}

export class ComboRequeridoDto {
  @IsString({ message: 'La categoría debe ser una cadena de texto' })
  @MinLength(2, { message: 'La categoría debe tener al menos 2 caracteres' })
  categoria: string;

  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  cantidad: number;
}

export class CreatePromocionDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre: string;

  @IsEnum(TipoPromocion, {
    message: 'El tipo debe ser: porcentaje, cantidad_fija o combo',
  })
  tipo: TipoPromocion;

  @IsNumber({}, { message: 'El valor debe ser un número' })
  @Min(0.01, { message: 'El valor debe ser mayor a 0' })
  valor: number;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Fecha inválida');
      }
      return date;
    }
    return value;
  })
  @IsDate({ message: 'fechaInicio debe ser una fecha válida (ej: "2025-07-24" o "2025-07-24T00:00:00Z")' })
  @Type(() => Date)
  fechaInicio: Date;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Fecha inválida');
      }
      return date;
    }
    return value;
  })
  @IsDate({ message: 'fechaFin debe ser una fecha válida (ej: "2025-07-31" o "2025-07-31T23:59:59Z")' })
  @Type(() => Date)
  fechaFin: Date;

  @IsString({ message: 'horaInicio debe ser una cadena de texto' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horaInicio debe tener formato HH:MM (ej: 14:30)',
  })
  horaInicio: string;

  @IsString({ message: 'horaFin debe ser una cadena de texto' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horaFin debe tener formato HH:MM (ej: 18:00)',
  })
  horaFin: string;

  @IsOptional()
  @IsArray({ message: 'usuariosAplicables debe ser un array' })
  @IsString({ each: true, message: 'Cada usuario debe ser una cadena de texto' })
  usuariosAplicables?: string[];

  @IsOptional()
  @IsArray({ message: 'categoriasAplicables debe ser un array' })
  @IsString({ each: true, message: 'Cada categoría debe ser una cadena de texto' })
  categoriasAplicables?: string[];

  @IsOptional()
  @IsBoolean({ message: 'activo debe ser true o false' })
  activo?: boolean;

  @IsOptional()
  @IsArray({ message: 'comboRequerido debe ser un array' })
  @ValidateNested({ each: true })
  @Type(() => ComboRequeridoDto)
  comboRequerido?: ComboRequeridoDto[];
}