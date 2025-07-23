import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promocion } from './promocion.entity';
import { CreatePromocionDto } from './dto/create-promocion.dto';
import { UpdatePromocionDto } from './dto/update-promocion.dto';

@Injectable()
export class PromocionesService {
  constructor(
    @InjectRepository(Promocion)
    private readonly promoRepo: Repository<Promocion>,
  ) {}

  create(dto: CreatePromocionDto) {
    const nueva = this.promoRepo.create(dto);
    return this.promoRepo.save(nueva);
  }

  findAll() {
    return this.promoRepo.find();
  }

  async findOne(id: number) {
    const promo = await this.promoRepo.findOne({ where: { id } });
    if (!promo) throw new NotFoundException('Promoción no encontrada');
    return promo;
  }

  async update(id: number, dto: UpdatePromocionDto) {
    const promo = await this.findOne(id);
    const actualizada = Object.assign(promo, dto);
    return this.promoRepo.save(actualizada);
  }

  async remove(id: number) {
    const promo = await this.findOne(id);
    await this.promoRepo.remove(promo);
  }

  async findActivePromotions(usuario: string, categoria: string): Promise<Promocion[]> {
    const now = new Date();
    const horaActual = now.toTimeString().slice(0, 5);

    return this.promoRepo
      .createQueryBuilder('promo')
      .where('promo.activo = true')
      .andWhere('promo.fechaInicio <= :now AND promo.fechaFin >= :now', { now })
      .andWhere('promo.horaInicio <= :hora AND promo.horaFin >= :hora', { hora: horaActual })
      .andWhere(':usuario = ANY(promo.usuariosAplicables)', { usuario })
      .orWhere(':categoria = ANY(promo.categoriasAplicables)', { categoria })
      .getMany();
  }
}
