import { NotificacionCocina } from '../entities/notificacion-cocina.entity';
import { EstadoCocina } from '../enums/estado-cocina.enum';

export class OrdenRecibidaEnCocinaEvent {
  constructor(
    public readonly notificacion: NotificacionCocina,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class EstadoCocinaActualizadoEvent {
  constructor(
    public readonly notificacionId: number,
    public readonly estadoAnterior: EstadoCocina,
    public readonly estadoNuevo: EstadoCocina,
    public readonly cocineroId?: number,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class OrdenListaParaServirEvent {
  constructor(
    public readonly notificacion: NotificacionCocina,
    public readonly tiempoPreparacion: number, 
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class OrdenCanceladaEnCocinaEvent {
  constructor(
    public readonly notificacionId: number,
    public readonly razon: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}