import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from './factura.entity';
import { Orden } from 'src/ordenes/orden.entity';

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura) private facturaRepo: Repository<Factura>,
    @InjectRepository(Orden) private ordenRepo: Repository<Orden>,
  ) {}

  async generarFactura(ordenId: number): Promise<Factura> {
    const orden = await this.ordenRepo.findOne({
      where: { id: ordenId },
      relations: ['items', 'items.platillo'],
    });

    if (!orden) throw new NotFoundException('Orden no encontrada');

    const subtotal = orden.items.reduce(
      (acc, item) => acc + Number(item.platillo.precioBase) * item.cantidad,
      0,
    );

    const descuento = this.calcularDescuento(orden); // opcional
    const total = subtotal - descuento;

    const factura = this.facturaRepo.create({ orden, subtotal, descuento, total });
    return this.facturaRepo.save(factura);
  }

  calcularDescuento(orden: Orden): number {
    return 0; // Puedes extenderlo con lógica de promociones
  }

  listarFacturas(): Promise<Factura[]> {
    return this.facturaRepo.find({ relations: ['orden'] });
  }

  async obtenerFactura(id: number): Promise<Factura> {
  const factura = await this.facturaRepo.findOne({ where: { id }, relations: ['orden'] });
  if (!factura) throw new NotFoundException(`Factura con ID ${id} no encontrada`);
  return factura;
}


  
}

