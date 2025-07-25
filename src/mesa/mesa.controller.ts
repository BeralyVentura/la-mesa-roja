import { Controller, Post, Get, Param, Patch } from '@nestjs/common';
import { MesaService } from './mesa.service';

@Controller('mesas')
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  @Post()
  create() {
    return this.mesaService.create();
  }

  @Get()
  findAll() {
    return this.mesaService.findAll();
  }

  @Patch(':id/ocupar')
  ocupar(@Param('id') id: number) {
    return this.mesaService.marcarComoOcupada(id);
  }

  @Patch(':id/disponible')
  disponible(@Param('id') id: number) {
    return this.mesaService.marcarComoDisponible(id);
  }
}
