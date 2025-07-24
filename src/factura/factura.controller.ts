import { Controller, Post, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entitites/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Factura')
@Controller('Factura')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @Post(':ordenId')
  @Roles(UserRole.ADMIN, UserRole.MESERO)
  @ApiOperation({ summary: 'Generar factura a partir de una orden' })
  generar(@Param('ordenId', ParseIntPipe) ordenId: number) {
    return this.facturaService.generarFactura(ordenId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar facturas generadas' })
  listar() {
    return this.facturaService.listarFacturas();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener una factura por ID' })
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.facturaService.obtenerFactura(id);
  }
}
