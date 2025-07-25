import { NotificacionCocina } from '../entities/notificacion-cocina.entity';

export interface PantallaCocinaResponse {
  timestamp: string;
  ordenesPendientes: NotificacionCocina[];
  ordenesEnPreparacion: NotificacionCocina[];
  ordenesListas: NotificacionCocina[];
  estadisticas: {
    porEstado: { estado: string; cantidad: string }[];
    tiempoPromedioMinutos: number;
  };
  resumen: {
    totalPendientes: number;
    totalEnPreparacion: number;
    totalListas: number;
  };
}

export interface PantallaCocineroResponse {
  timestamp: string;
  cocineroId: number;
  misOrdenes: NotificacionCocina[];
  ordenesSinAsignar: NotificacionCocina[];
  resumen: {
    totalAsignadas: number;
    sinAsignar: number;
  };
}