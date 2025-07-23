import { Controller, Post, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('factura')
@Controller('factura')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @Post(':ordenId')
  @ApiOperation({ summary: 'Generar factura a partir de una orden' })
  generar(@Param('ordenId', ParseIntPipe) ordenId: number) {
    return this.facturaService.generarFactura(ordenId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar facturas generadas' })
  listar() {
    return this.facturaService.listarFacturas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una factura por ID' })
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.facturaService.obtenerFactura(id);
  }
}

