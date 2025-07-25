import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OrdenRecibidaEnCocinaEvent,
  EstadoCocinaActualizadoEvent,
  OrdenListaParaServirEvent,
  OrdenCanceladaEnCocinaEvent,
} from '../events/cocina-events';
import { OrdenesService } from 'src/ordenes/ordenes.service';
import { EstadoOrden } from 'src/common/enums/estado-orden.enum';

@Injectable()
export class CocinaEventListener {
  constructor(private readonly ordenesService: OrdenesService) {}

  @OnEvent('cocina.orden.recibida')
  async manejarOrdenRecibida(evento: OrdenRecibidaEnCocinaEvent) {
    try {
      await this.ordenesService.cambiarEstado(
        evento.notificacion.orden.id,
        EstadoOrden.EN_COCINA,
      );
      
      console.log(`📨 [LISTENER] Orden #${evento.notificacion.orden.id} marcada como EN_COCINA`);
    } catch (error) {
      console.error('Error al actualizar estado de orden:', error);
    }
  }

  @OnEvent('cocina.estado.actualizado')
  async manejarCambioEstado(evento: EstadoCocinaActualizadoEvent) {
    console.log(`🔄 [LISTENER] Estado de cocina actualizado para notificación #${evento.notificacionId}`);
  }

  @OnEvent('cocina.orden.lista')
  async manejarOrdenLista(evento: OrdenListaParaServirEvent) {
    try {
      await this.ordenesService.cambiarEstado(
        evento.notificacion.orden.id,
        EstadoOrden.SERVIDA,
      );
      
      console.log(`🍽️ [LISTENER] Orden #${evento.notificacion.orden.id} lista para servir (${evento.tiempoPreparacion} min)`);
    } catch (error) {
      console.error('Error al marcar orden como servida:', error);
    }
  }

  @OnEvent('cocina.orden.cancelada')
  async manejarOrdenCancelada(evento: OrdenCanceladaEnCocinaEvent) {
    console.log(`🚫 [LISTENER] Orden cancelada en cocina: ${evento.razon}`);
  }
}