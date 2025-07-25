import { 
  IsString, 
  IsNumber, 
  IsArray, 
  ValidateNested, 
  ArrayMinSize, 
  Min, 
  MinLength 
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrdenItemDto {
  @IsNumber({}, { message: 'platilloId debe ser un número' })
  @Min(1, { message: 'platilloId debe ser mayor a 0' })
  platilloId: number;

  @IsString({ message: 'nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'nombre debe tener al menos 2 caracteres' })
  nombre: string;

  @IsString({ message: 'categoria debe ser una cadena de texto' })
  @MinLength(2, { message: 'categoria debe tener al menos 2 caracteres' })
  categoria: string;

  @IsNumber({}, { message: 'precio debe ser un número' })
  @Min(0.01, { message: 'precio debe ser mayor a 0' })
  precio: number;

  @IsNumber({}, { message: 'cantidad debe ser un número' })
  @Min(1, { message: 'cantidad debe ser al menos 1' })
  cantidad: number;
}

export class CreateOrdenDto {
  @IsNumber({}, { message: 'mesa debe ser un número' })
  @Min(1, { message: 'mesa debe ser mayor a 0' })
  mesa: number;

  @IsString({ message: 'usuario debe ser una cadena de texto' })
  @MinLength(2, { message: 'usuario debe tener al menos 2 caracteres' })
  usuario: string;

  @IsArray({ message: 'items debe ser un array' })
  @ArrayMinSize(1, { message: 'debe incluir al menos un item' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrdenItemDto)
  items: CreateOrdenItemDto[];
}