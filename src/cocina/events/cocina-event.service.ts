import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  OrdenRecibidaEnCocinaEvent,
  EstadoCocinaActualizadoEvent,
  OrdenListaParaServirEvent,
  OrdenCanceladaEnCocinaEvent,
} from './cocina-events';
import { NotificacionCocina } from '../entities/notificacion-cocina.entity';
import { EstadoCocina } from '../enums/estado-cocina.enum';

@Injectable()
export class CocinaEventService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emitirOrdenRecibida(notificacion: NotificacionCocina) {
    const evento = new OrdenRecibidaEnCocinaEvent(notificacion);
    this.eventEmitter.emit('cocina.orden.recibida', evento);
    console.log(`🔔 [COCINA] Nueva orden recibida: #${notificacion.orden.id}`);
  }

  emitirCambioEstado(
    notificacionId: number,
    estadoAnterior: EstadoCocina,
    estadoNuevo: EstadoCocina,
    cocineroId?: number,
  ) {
    const evento = new EstadoCocinaActualizadoEvent(
      notificacionId,
      estadoAnterior,
      estadoNuevo,
      cocineroId,
    );
    this.eventEmitter.emit('cocina.estado.actualizado', evento);
    console.log(`🔄 [COCINA] Estado actualizado: ${estadoAnterior} → ${estadoNuevo}`);
  }

  emitirOrdenLista(notificacion: NotificacionCocina, tiempoPreparacion: number) {
    const evento = new OrdenListaParaServirEvent(notificacion, tiempoPreparacion);
    this.eventEmitter.emit('cocina.orden.lista', evento);
    console.log(`✅ [COCINA] Orden lista para servir: #${notificacion.orden.id}`);
  }

  emitirOrdenCancelada(notificacionId: number, razon: string) {
    const evento = new OrdenCanceladaEnCocinaEvent(notificacionId, razon);
    this.eventEmitter.emit('cocina.orden.cancelada', evento);
    console.log(`❌ [COCINA] Orden cancelada: ${razon}`);
  }
}