import { PartialType } from '@nestjs/mapped-types';
import { CreatePromocionDto, TipoPromocion, ComboRequeridoDto } from './create-promocion.dto';
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

export class UpdatePromocionDto extends PartialType(CreatePromocionDto) {
  @IsOptional()
  @IsString()
  @MinLength(3)
  nombre?: string;

  @IsOptional()
  @IsEnum(TipoPromocion)
  tipo?: TipoPromocion;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  valor?: number;

  @IsOptional()
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
  @IsDate()
  @Type(() => Date)
  fechaInicio?: Date;

  @IsOptional()
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
  @IsDate()
  @Type(() => Date)
  fechaFin?: Date;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  horaInicio?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  horaFin?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  usuariosAplicables?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoriasAplicables?: string[];

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComboRequeridoDto)
  comboRequerido?: ComboRequeridoDto[];
}