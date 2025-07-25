import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PromocionesService } from './promociones.service';
import { CreatePromocionDto } from './dto/create-promocion.dto';
import { UpdatePromocionDto } from './dto/update-promocion.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entitites/user.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Promociones')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('promociones')
export class PromocionesController {
  constructor(private readonly service: PromocionesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear una nueva promoción' })
  @ApiResponse({ status: 201, description: 'Promoción creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createPromocionDto: CreatePromocionDto) {
    return this.service.create(createPromocionDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener todas las promociones' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MESERO)
  @ApiOperation({ summary: 'Obtener una promoción por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar una promoción' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePromocionDto: UpdatePromocionDto,
  ) {
    return this.service.update(id, updatePromocionDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar una promoción' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Get('/activas/buscar')
  @Roles(UserRole.ADMIN, UserRole.MESERO, UserRole.COCINERO, UserRole.CLIENTE)
  @ApiOperation({ summary: 'Buscar promociones activas' })
  findActivas(
    @Query('usuario') usuario: string,
    @Query('categoria') categoria: string,
  ) {
    return this.service.findActivePromotions(usuario, categoria);
  }
}