import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orden } from './orden.entity';
import { OrdenItem } from './orden-item.entity';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { PromocionesService } from 'src/promociones/promociones.service';
import { EstadoOrden } from 'src/common/enums/estado-orden.enum';

@Injectable()
export class OrdenesService {
  constructor(
    @InjectRepository(Orden)
    private readonly ordenRepo: Repository<Orden>,
    @InjectRepository(OrdenItem)
    private readonly itemRepo: Repository<OrdenItem>,
    private readonly promocionesService: PromocionesService,
  ) {}

  async create(dto: CreateOrdenDto) {
    try {
      const { usuario, mesa, items } = dto;

      // Validación básica
      if (!usuario || typeof usuario !== 'string') {
        throw new Error('Falta el campo "usuario" o es inválido.');
      }

      if (!mesa || typeof mesa !== 'number') {
        throw new Error('Falta el campo "mesa" o es inválido.');
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error('La orden no contiene platillos válidos.');
      }

      const subtotal = items.reduce((sum, item) => {
        if (
          item.precio === undefined ||
          item.cantidad === undefined ||
          item.precio === null ||
          item.cantidad === null
        ) {
          throw new Error('Cada platillo debe tener precio y cantidad.');
        }
        return sum + item.precio * item.cantidad;
      }, 0);

      const categorias = [
        ...new Set(items.map(i => i.categoria).filter(Boolean)),
      ];

      const promociones =
        await this.promocionesService.findActivePromotions(
          usuario,
          categorias[0], // para simplificar se evalúa por la primera categoría
        );

      let descuentoTotal = 0;
      const promocionesAplicadas: string[] = [];

      for (const promo of promociones) {
        if (promo.tipo === 'porcentaje') {
          const descuento = subtotal * (promo.valor / 100);
          descuentoTotal += descuento;
          promocionesAplicadas.push(promo.nombre);
        } else if (promo.tipo === 'cantidad_fija') {
          descuentoTotal += promo.valor;
          promocionesAplicadas.push(promo.nombre);
        } else if (
          promo.tipo === 'combo' &&
          Array.isArray(promo.comboRequerido)
        ) {
          const cumpleCombo = promo.comboRequerido.every(requisito => {
            const totalCategoria = items
              .filter(i => i.categoria === requisito.categoria)
              .reduce((sum, i) => sum + i.cantidad, 0);
            return totalCategoria >= requisito.cantidad;
          });

          if (cumpleCombo) {
            descuentoTotal += subtotal - promo.valor;
            promocionesAplicadas.push(promo.nombre);
          }
        }
      }

      const total = subtotal - descuentoTotal;

      const orden = this.ordenRepo.create({
        mesa,
        usuario,
        subtotal,
        descuentoTotal,
        total,
        promocionesAplicadas,
        items: items.map(i => this.itemRepo.create(i)),
      });

      console.log('🧾 Orden procesada correctamente:', {
        mesa,
        usuario,
        subtotal,
        descuentoTotal,
        total,
        promocionesAplicadas,
      });

      return await this.ordenRepo.save(orden);
    } catch (error) {
      console.error('❌ Error al crear la orden:', error.message);
      throw new InternalServerErrorException(
        'No se pudo crear la orden. Detalles en consola.',
      );
    }
  }

  findAll() {
    return this.ordenRepo.find();
  }

  async findByEstado(estado: EstadoOrden) {
    return this.ordenRepo.find({ where: { estado } });
  }

  async cambiarEstado(id: number, nuevoEstado: EstadoOrden) {
    const orden = await this.ordenRepo.findOneBy({ id });

    if (!orden) {
      throw new Error('Orden no encontrada');
    }

    orden.estado = nuevoEstado;
    return this.ordenRepo.save(orden);
  }
}
