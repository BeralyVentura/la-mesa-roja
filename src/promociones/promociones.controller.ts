import { Controller, Post, Get, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { PromocionesService } from './promociones.service';
import { CreatePromocionDto } from './dto/create-promocion.dto';
import { UpdatePromocionDto } from './dto/update-promocion.dto';

@Controller('promociones')
export class PromocionesController {
  constructor(private readonly service: PromocionesService) {}

  @Post()
  create(@Body() dto: CreatePromocionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePromocionDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Get('/activas/buscar')
  findActivas(
    @Query('usuario') usuario: string,
    @Query('categoria') categoria: string,
  ) {
    return this.service.findActivePromotions(usuario, categoria);
  }
}
