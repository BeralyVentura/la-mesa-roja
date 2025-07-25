import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { NotificacionCocina } from './entities/notificacion-cocina.entity';
import { HistorialEstado } from './entities/historial-estado.entity';
import { Orden } from 'src/ordenes/orden.entity';
import { User, UserRole } from 'src/users/entitites/user.entity';
import { EstadoCocina } from './enums/estado-cocina.enum';
import { CrearNotificacionCocinaDto } from './dto/crear-notificacion-cocina.dto';
import { ActualizarEstadoCocinaDto } from './dto/actualizar-estado-cocina.dto';
import { FiltrosCocinaDto } from './dto/filtros-cocina.dto';
import { CocinaEventService } from './events/cocina-event.service';

@Injectable()
export class CocinaService {
  constructor(
    @InjectRepository(NotificacionCocina)
    private readonly notificacionRepo: Repository<NotificacionCocina>,
    
    @InjectRepository(HistorialEstado)
    private readonly historialRepo: Repository<HistorialEstado>,
    
    @InjectRepository(Orden)
    private readonly ordenRepo: Repository<Orden>,
    
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    
    private readonly eventService: CocinaEventService,
  ) {}

  async crearNotificacion(dto: CrearNotificacionCocinaDto): Promise<NotificacionCocina> {
    const orden = await this.ordenRepo.findOne({
      where: { id: dto.ordenId },
      relations: ['items'],
    });

    if (!orden) {
      throw new NotFoundException('Orden no encontrada');
    }

    const notificacionExistente = await this.notificacionRepo.findOne({
      where: { orden: { id: dto.ordenId } },
    });

    if (notificacionExistente) {
      throw new BadRequestException('Ya existe una notificación de cocina para esta orden');
    }

    let cocineroAsignado: User | null = null; 
    if (dto.cocineroAsignadoId) {
      cocineroAsignado = await this.userRepo.findOne({
        where: { id: dto.cocineroAsignadoId, role: UserRole.COCINERO },
      });

      if (!cocineroAsignado) {
        throw new BadRequestException('El usuario especificado no es un cocinero válido');
      }
    }

    const tiempoEstimado = dto.tiempoEstimadoMinutos || this.calcularTiempoEstimado(orden);

    const notificacion = this.notificacionRepo.create({
      orden,
      cocineroAsignado, 
      notas: dto.notas || null,
      tiempoEstimadoMinutos: tiempoEstimado,
      prioridad: dto.prioridad || 2,
      estado: EstadoCocina.RECIBIDA,
    });

    const notificacionGuardada = await this.notificacionRepo.save(notificacion); 

    this.eventService.emitirOrdenRecibida(notificacionGuardada);

    return notificacionGuardada;
  }

  async obtenerNotificaciones(filtros: FiltrosCocinaDto = {}): Promise<NotificacionCocina[]> {
    const queryBuilder = this.notificacionRepo
      .createQueryBuilder('notificacion')
      .leftJoinAndSelect('notificacion.orden', 'orden')
      .leftJoinAndSelect('orden.items', 'items')
      .leftJoinAndSelect('notificacion.cocineroAsignado', 'cocinero')
      .orderBy('notificacion.prioridad', 'ASC')
      .addOrderBy('notificacion.fechaCreacion', 'DESC');

    if (filtros.estado) {
      queryBuilder.andWhere('notificacion.estado = :estado', { estado: filtros.estado });
    }

    if (filtros.cocineroId) {
      queryBuilder.andWhere('cocinero.id = :cocineroId', { cocineroId: filtros.cocineroId });
    }

    if (filtros.prioridad) {
      queryBuilder.andWhere('notificacion.prioridad = :prioridad', { prioridad: filtros.prioridad });
    }

    if (filtros.mesa) {
      queryBuilder.andWhere('orden.mesa = :mesa', { mesa: filtros.mesa });
    }

    if (filtros.categoria) {
      queryBuilder.andWhere('items.categoria = :categoria', { categoria: filtros.categoria });
    }

    return queryBuilder.getMany();
  }

  async obtenerNotificacionPorId(id: number): Promise<NotificacionCocina> {
    const notificacion = await this.notificacionRepo.findOne({
      where: { id },
      relations: ['orden', 'orden.items', 'cocineroAsignado'],
    });

    if (!notificacion) {
      throw new NotFoundException('Notificación de cocina no encontrada');
    }

    return notificacion;
  }

  async actualizarEstado(
    id: number,
    dto: ActualizarEstadoCocinaDto,
    usuarioId: number,
  ): Promise<NotificacionCocina> {
    const notificacion = await this.obtenerNotificacionPorId(id);
    const estadoAnterior = notificacion.estado;

    this.validarTransicionEstado(estadoAnterior, dto.estado);

    if (dto.cocineroAsignadoId) {
      const cocinero = await this.userRepo.findOne({
        where: { id: dto.cocineroAsignadoId, role: UserRole.COCINERO },
      });

      if (!cocinero) {
        throw new BadRequestException('El usuario especificado no es un cocinero válido');
      }

      notificacion.cocineroAsignado = cocinero;
    }

    notificacion.estado = dto.estado;
    if (dto.notas !== undefined) notificacion.notas = dto.notas;
    if (dto.tiempoEstimadoMinutos) notificacion.tiempoEstimadoMinutos = dto.tiempoEstimadoMinutos;

    if (dto.estado === EstadoCocina.EN_PREPARACION && !notificacion.horaInicio) {
      notificacion.horaInicio = new Date();
    }

    if (dto.estado === EstadoCocina.LISTA_PARA_SERVIR && !notificacion.horaFinalizacion) {
      notificacion.horaFinalizacion = new Date();
    }

    const notificacionActualizada = await this.notificacionRepo.save(notificacion);

    await this.registrarCambioEstado(
      notificacionActualizada,
      estadoAnterior,
      dto.estado,
      usuarioId,
      dto.observaciones,
    );

    this.eventService.emitirCambioEstado(
      id,
      estadoAnterior,
      dto.estado,
      notificacion.cocineroAsignado?.id,
    );

    if (dto.estado === EstadoCocina.LISTA_PARA_SERVIR) {
      const tiempoPreparacion = this.calcularTiempoPreparacion(notificacion);
      this.eventService.emitirOrdenLista(notificacionActualizada, tiempoPreparacion);
    }

    return notificacionActualizada;
  }

  async asignarCocinero(id: number, cocineroId: number): Promise<NotificacionCocina> {
    const notificacion = await this.obtenerNotificacionPorId(id);

    const cocinero = await this.userRepo.findOne({
      where: { id: cocineroId, role: UserRole.COCINERO, isActive: true },
    });

    if (!cocinero) {
      throw new BadRequestException('Cocinero no válido o inactivo');
    }

    notificacion.cocineroAsignado = cocinero;
    return this.notificacionRepo.save(notificacion);
  }

  async cancelarOrden(id: number, razon: string, usuarioId: number): Promise<void> {
    const notificacion = await this.obtenerNotificacionPorId(id);

    if (notificacion.estado === EstadoCocina.ENTREGADA) {
      throw new BadRequestException('No se puede cancelar una orden ya entregada');
    }

    const estadoAnterior = notificacion.estado;
    notificacion.estado = EstadoCocina.CANCELADA;
    notificacion.notas = `CANCELADA: ${razon}`;

    await this.notificacionRepo.save(notificacion);

    await this.registrarCambioEstado(
      notificacion,
      estadoAnterior,
      EstadoCocina.CANCELADA,
      usuarioId,
      razon,
    );

    this.eventService.emitirOrdenCancelada(id, razon);
  }

  async obtenerEstadisticasCocina() {
    const stats = await this.notificacionRepo
      .createQueryBuilder('notificacion')
      .select('notificacion.estado', 'estado')
      .addSelect('COUNT(*)', 'cantidad')
      .groupBy('notificacion.estado')
      .getRawMany();

    const tiempoPromedio = await this.notificacionRepo
      .createQueryBuilder('notificacion')
      .select('AVG(notificacion.tiempoEstimadoMinutos)', 'tiempoPromedio')
      .where('notificacion.estado = :estado', { estado: EstadoCocina.ENTREGADA })
      .getRawOne();

    return {
      porEstado: stats,
      tiempoPromedioMinutos: parseInt(tiempoPromedio.tiempoPromedio) || 0,
    };
  }

  async obtenerHistorialOrden(ordenId: number): Promise<HistorialEstado[]> {
    return this.historialRepo.find({
      where: { notificacion: { orden: { id: ordenId } } },
      relations: ['usuarioModificacion'],
      order: { fechaCambio: 'DESC' },
    });
  }

  async calcularTiemposDeAtencion() {
    const historiales = await this.historialRepo.find({
      relations: ['notificacion', 'notificacion.orden'],
      order: { fechaCambio: 'ASC' }
    });

    const tiemposPorOrden = {};

    for (const h of historiales) {
      const idOrden = h.notificacion.orden.id;

      if (!tiemposPorOrden[idOrden]) {
        tiemposPorOrden[idOrden] = { inicio: null, fin: null };
      }

      if (h.estadoNuevo === EstadoCocina.EN_PREPARACION && !tiemposPorOrden[idOrden].inicio) {
        tiemposPorOrden[idOrden].inicio = h.fechaCambio;
      } else if (h.estadoNuevo === EstadoCocina.LISTA_PARA_SERVIR) {
        tiemposPorOrden[idOrden].fin = h.fechaCambio;
      }
    }

      const resultados: { ordenId: number; duracionMin: number }[] = [];

      for (const [id, tiempo] of Object.entries(tiemposPorOrden) as [string, { inicio: Date, fin: Date }][]) {
        if (tiempo.inicio && tiempo.fin) {
          const duracionMs = new Date(tiempo.fin).getTime() - new Date(tiempo.inicio).getTime();
          resultados.push({
            ordenId: Number(id),
            duracionMin: Math.round(duracionMs / 60000),
          });
        }
      }


    return resultados;
  }

  private calcularTiempoEstimado(orden: Orden): number {
    const tiempoBase = 5;
    const tiempoPorItem = 3;
    const totalItems = orden.items?.reduce((sum, item) => sum + item.cantidad, 0) || 0;
    
    return tiempoBase + (totalItems * tiempoPorItem);
  }

  private calcularTiempoPreparacion(notificacion: NotificacionCocina): number {
    if (!notificacion.horaInicio || !notificacion.horaFinalizacion) {
      return 0;
    }

    const diff = notificacion.horaFinalizacion.getTime() - notificacion.horaInicio.getTime();
    return Math.round(diff / (1000 * 60)); // convertir a minutos
  }

  private validarTransicionEstado(estadoActual: EstadoCocina, estadoNuevo: EstadoCocina): void {
    const transicionesValidas: Record<EstadoCocina, EstadoCocina[]> = { 
      [EstadoCocina.RECIBIDA]: [EstadoCocina.EN_PREPARACION, EstadoCocina.CANCELADA],
      [EstadoCocina.EN_PREPARACION]: [EstadoCocina.LISTA_PARA_SERVIR, EstadoCocina.CANCELADA],
      [EstadoCocina.LISTA_PARA_SERVIR]: [EstadoCocina.ENTREGADA, EstadoCocina.CANCELADA],
      [EstadoCocina.ENTREGADA]: [], 
      [EstadoCocina.CANCELADA]: [], 
    };

    if (!transicionesValidas[estadoActual]?.includes(estadoNuevo)) {
      throw new BadRequestException(
        `Transición inválida de ${estadoActual} a ${estadoNuevo}`,
      );
    }
  }

  private async registrarCambioEstado(
    notificacion: NotificacionCocina,
    estadoAnterior: EstadoCocina,
    estadoNuevo: EstadoCocina,
    usuarioId: number,
    observaciones?: string,
  ): Promise<void> {
    const usuario = await this.userRepo.findOne({ where: { id: usuarioId } });

    const historial = this.historialRepo.create({
      notificacion,
      estadoAnterior,
      estadoNuevo,
      usuarioModificacion: usuario || null, 
      observaciones: observaciones || null,
    });

    await this.historialRepo.save(historial);
  }
}