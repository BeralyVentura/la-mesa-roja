export class CreatePromocionDto {
    nombre: string;
    tipo: 'porcentaje' | 'cantidad_fija' | 'combo';
    valor: number;
    fechaInicio: Date;
    fechaFin: Date;
    horaInicio: string;
    horaFin: string;
    usuariosAplicables?: string[];
    categoriasAplicables?: string[];
    activo?: boolean;
    comboRequerido?: { categoria: string; cantidad: number }[];

  }
  