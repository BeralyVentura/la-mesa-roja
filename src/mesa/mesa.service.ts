import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from './mesa.entity';

@Injectable()
export class MesaService {
  constructor(@InjectRepository(Mesa) private mesaRepo: Repository<Mesa>) {}

  async create(): Promise<Mesa> {
    const nuevaMesa = this.mesaRepo.create();
    return this.mesaRepo.save(nuevaMesa);
  }

  async findAll(): Promise<Mesa[]> {
    return this.mesaRepo.find();
  }

  async marcarComoOcupada(id: number): Promise<Mesa> {
    const mesa = await this.mesaRepo.findOneBy({ id });
    if (!mesa) throw new Error('Mesa no encontrada');
    mesa.disponible = false;
    return this.mesaRepo.save(mesa);
  }

  async marcarComoDisponible(id: number): Promise<Mesa> {
    const mesa = await this.mesaRepo.findOneBy({ id });
    if (!mesa) throw new Error('Mesa no encontrada');
    mesa.disponible = true;
    return this.mesaRepo.save(mesa);
  }
}