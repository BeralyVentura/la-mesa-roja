import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CocinaService } from './cocina.service';
import { CrearNotificacionCocinaDto } from './dto/crear-notificacion-cocina.dto';
import { ActualizarEstadoCocinaDto } from './dto/actualizar-estado-cocina.dto';
import { FiltrosCocinaDto } from './dto/filtros-cocina.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entitites/user.entity';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { EstadoCocina } from './enums/estado-cocina.enum';

@ApiTags('Cocina')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cocina')
export class CocinaController {
  constructor(private readonly cocinaService: CocinaService) {}

  @Post('notificaciones')
  @Roles(UserRole.ADMIN, UserRole.MESERO, UserRole.COCINERO)
  @ApiOperation({ summary: 'Crear notificación de cocina para una orden' })
  async crearNotificacion(@Body() dto: CrearNotificacionCocinaDto) {
    return this.cocinaService.crearNotificacion(dto);
  }

  @Get('notificaciones')
  @Roles(UserRole.ADMIN, UserRole.COCINERO)
  @ApiOperation({ summary: 'Obtener todas las notificaciones de cocina con filtros' })
  async obtenerNotificaciones(@Query() filtros: FiltrosCocinaDto) {
    return this.cocinaService.obtenerNotificaciones(filtros);
  }

  @Get('notificaciones/:id')
  @Roles(UserRole.ADMIN, UserRole.COCINERO)
  @ApiOperation({ summary: 'Obtener una notificación específica' })
  async obtenerNotificacion(@Param('id', ParseIntPipe) id: number) {
    return this.cocinaService.obtenerNotificacionPorId(id);
  }

  @Patch('notificaciones/:id/estado')
  @Roles(UserRole.COCINERO, UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar estado de una orden en cocina' })
  async actualizarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarEstadoCocinaDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.cocinaService.actualizarEstado(id, dto, req.user.id);
  }

  @Patch('notificaciones/:id/asignar-cocinero')
  @Roles(UserRole.ADMIN, UserRole.COCINERO)
  @ApiOperation({ summary: 'Asignar cocinero a una orden' })
  async asignarCocinero(
    @Param('id', ParseIntPipe) id: number,
    @Body('cocineroId', ParseIntPipe) cocineroId: number,
  ) {
    return this.cocinaService.asignarCocinero(id, cocineroId);
  }

  @Delete('notificaciones/:id/cancelar')
  @Roles(UserRole.ADMIN, UserRole.COCINERO)
  @ApiOperation({ summary: 'Cancelar orden en cocina' })
  async cancelarOrden(
    @Param('id', ParseIntPipe) id: number,
    @Body('razon') razon: string,
    @Request() req: AuthenticatedRequest,
  ) {
    if (!razon) {
      throw new BadRequestException('Se requiere especificar la razón de cancelación');
    }
    return this.cocinaService.cancelarOrden(id, razon, req.user.id);
  }

  @Get('pantalla')
  @Roles(UserRole.COCINERO, UserRole.ADMIN)
  @ApiOperation({ summary: 'Pantalla digital de cocina - Vista principal' })
  async pantallaCocina() {
    const ordenesPendientes = await this.cocinaService.obtenerNotificaciones({
      estado: EstadoCocina.RECIBIDA,
    });

    const ordenesEnPreparacion = await this.cocinaService.obtenerNotificaciones({
      estado: EstadoCocina.EN_PREPARACION,
    });

    const ordenesListas = await this.cocinaService.obtenerNotificaciones({
      estado: EstadoCocina.LISTA_PARA_SERVIR,
    });

    const estadisticas = await this.cocinaService.obtenerEstadisticasCocina();

    return {
      timestamp: new Date().toISOString(),
      ordenesPendientes,
      ordenesEnPreparacion,
      ordenesListas,
      estadisticas,
      resumen: {
        totalPendientes: ordenesPendientes.length,
        totalEnPreparacion: ordenesEnPreparacion.length,
        totalListas: ordenesListas.length,
      },
    };
  }

  @Get('pantalla/cocinero/:cocineroId')
  @Roles(UserRole.COCINERO, UserRole.ADMIN)
  @ApiOperation({ summary: 'Vista personalizada por cocinero' })
  async pantallaCocinero(@Param('cocineroId', ParseIntPipe) cocineroId: number) {
    const misOrdenes = await this.cocinaService.obtenerNotificaciones({
      cocineroId,
    });

    const ordenesSinAsignar = await this.cocinaService.obtenerNotificaciones({
      estado: EstadoCocina.RECIBIDA,
    });

    return {
      timestamp: new Date().toISOString(),
      cocineroId,
      misOrdenes: misOrdenes.filter(o => 
        o.estado !== EstadoCocina.ENTREGADA && 
        o.estado !== EstadoCocina.CANCELADA
      ),
      ordenesSinAsignar,
      resumen: {
        totalAsignadas: misOrdenes.length,
        sinAsignar: ordenesSinAsignar.length,
      },
    };
  }

  @Get('pantalla/mesa/:mesa')
  @Roles(UserRole.COCINERO, UserRole.ADMIN, UserRole.MESERO)
  @ApiOperation({ summary: 'Ver órdenes por mesa específica' })
  async ordenesPorMesa(@Param('mesa', ParseIntPipe) mesa: number) {
    return this.cocinaService.obtenerNotificaciones({ mesa });
  }

  @Patch('pantalla/:id/iniciar')
  @Roles(UserRole.COCINERO)
  @ApiOperation({ summary: 'Iniciar preparación de orden (desde pantalla)' })
  async iniciarPreparacion(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.cocinaService.actualizarEstado(
      id,
      {
        estado: EstadoCocina.EN_PREPARACION,
        cocineroAsignadoId: req.user.id,
      },
      req.user.id,
    );
  }

  @Patch('pantalla/:id/finalizar')
  @Roles(UserRole.COCINERO)
  @ApiOperation({ summary: 'Marcar orden como lista (desde pantalla)' })
  async finalizarPreparacion(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.cocinaService.actualizarEstado(
      id,
      { estado: EstadoCocina.LISTA_PARA_SERVIR },
      req.user.id,
    );
  }

  @Patch('pantalla/:id/entregar')
  @Roles(UserRole.COCINERO, UserRole.MESERO)
  @ApiOperation({ summary: 'Marcar orden como entregada (desde pantalla)' })
  async marcarEntregada(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.cocinaService.actualizarEstado(
      id,
      { estado: EstadoCocina.ENTREGADA },
      req.user.id,
    );
  }

  @Get('estadisticas')
  @Roles(UserRole.ADMIN, UserRole.COCINERO)
  @ApiOperation({ summary: 'Estadísticas generales de cocina' })
  async obtenerEstadisticas() {
    return this.cocinaService.obtenerEstadisticasCocina();
  }

  @Get('historial/orden/:ordenId')
  @Roles(UserRole.ADMIN, UserRole.COCINERO)
  @ApiOperation({ summary: 'Historial de cambios de una orden específica' })
  async obtenerHistorialOrden(@Param('ordenId', ParseIntPipe) ordenId: number) {
    return this.cocinaService.obtenerHistorialOrden(ordenId);
  }

  @Post('ordenes/:ordenId/notificar')
  @Roles(UserRole.ADMIN, UserRole.MESERO)
  @ApiOperation({ summary: 'Crear notificación automática cuando se crea una orden' })
  async notificarNuevaOrden(
    @Param('ordenId', ParseIntPipe) ordenId: number,
    @Body() dto?: { cocineroAsignadoId?: number; prioridad?: number },
  ) {
    return this.cocinaService.crearNotificacion({
      ordenId,
      cocineroAsignadoId: dto?.cocineroAsignadoId,
      prioridad: dto?.prioridad,
    });
  }

  @Get('pantalla/actualizaciones')
  @Roles(UserRole.COCINERO, UserRole.ADMIN)
  @ApiOperation({ summary: 'Endpoint para polling de actualizaciones en tiempo real' })
  async obtenerActualizaciones(@Query('timestamp') ultimaActualizacion?: string) {
    const ahora = new Date();
    const desde = ultimaActualizacion ? new Date(ultimaActualizacion) : new Date(ahora.getTime() - 30000);

    const notificacionesRecientes = await this.cocinaService.obtenerNotificaciones({});
    
    const actualizaciones = notificacionesRecientes.filter(
      n => n.fechaActualizacion > desde
    );

    return {
      timestamp: ahora.toISOString(),
      hayActualizaciones: actualizaciones.length > 0,
      actualizaciones,
    };
  }
}