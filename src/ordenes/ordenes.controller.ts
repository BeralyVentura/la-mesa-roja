import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Patch,
  ParseIntPipe,
  Query
} from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entitites/user.entity';
import { EstadoOrden } from 'src/common/enums/estado-orden.enum';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Órdenes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ordenes')
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MESERO)
  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiResponse({ status: 201, description: 'Orden creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  create(@Body() createOrdenDto: CreateOrdenDto) { 
    return this.ordenesService.create(createOrdenDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MESERO, UserRole.COCINERO)
  @ApiOperation({ summary: 'Obtener todas las órdenes' })
  findAll() {
    return this.ordenesService.findAll();
  }

  @Get('estado/:estado')
  @Roles(UserRole.ADMIN, UserRole.MESERO, UserRole.COCINERO)
  @ApiOperation({ summary: 'Obtener órdenes por estado' })
  findByEstado(@Param('estado') estado: EstadoOrden) {
    return this.ordenesService.findByEstado(estado);
  }

  @Patch(':id/estado')
  @Roles(UserRole.ADMIN, UserRole.COCINERO)
  @ApiOperation({ summary: 'Cambiar estado de una orden' })
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') nuevoEstado: EstadoOrden,
  ) {
    return this.ordenesService.cambiarEstado(id, nuevoEstado);
  }
}