import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CocinaService } from '../cocina.service';

interface OrdenCreadaEvent {
  ordenId: number;
  mesa: number;
  usuario: string;
  items: any[];
  total: number;
  timestamp: Date;
}

@Injectable()
export class OrdenCreatedListener {
  constructor(private readonly cocinaService: CocinaService) {}

  @OnEvent('orden.creada')
  async manejarOrdenCreada(evento: OrdenCreadaEvent) {
    try {
      console.log(`🔔 [COCINA-LISTENER] Nueva orden recibida: #${evento.ordenId}`);
      
      let prioridad = 2; 
      if (evento.total > 50) prioridad = 1; 
      if (evento.total < 20) prioridad = 3; 

      await this.cocinaService.crearNotificacion({
        ordenId: evento.ordenId,
        tiempoEstimadoMinutos: this.calcularTiempoEstimado(evento.items),
        prioridad,
        notas: `Mesa ${evento.mesa} - ${evento.usuario}`,
      });

      console.log(`✅ [COCINA-LISTENER] Notificación creada para orden #${evento.ordenId}`);
    } catch (error) {
      console.error(`❌ [COCINA-LISTENER] Error al crear notificación:`, error);
    }
  }

  private calcularTiempoEstimado(items: any[]): number {
    const tiempoBase = 10;
    const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
    return tiempoBase + (totalItems * 2);
  }
}