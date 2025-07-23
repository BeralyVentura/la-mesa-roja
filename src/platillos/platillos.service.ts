import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Platillo } from './platillo.entity';
import { CreatePlatilloDto } from './dto/create-platillo.dto';
import { UpdatePlatilloDto } from './dto/update-platillo.dto';

@Injectable()
export class PlatillosService {
  constructor(
    @InjectRepository(Platillo)
    private readonly platilloRepo: Repository<Platillo>,
  ) {}

  async create(dto: CreatePlatilloDto): Promise<Platillo> {
    const nuevo = this.platilloRepo.create(dto);
    return this.platilloRepo.save(nuevo);
  }

  async findAll(): Promise<Platillo[]> {
    return this.platilloRepo.find();
  }

  async findOne(id: number): Promise<Platillo> {
    const platillo = await this.platilloRepo.findOne({ where: { id } });
    if (!platillo) throw new NotFoundException('Platillo no encontrado');
    return platillo;
  }

  async update(id: number, dto: UpdatePlatilloDto): Promise<Platillo> {
    const platillo = await this.findOne(id);
    const actualizado = Object.assign(platillo, dto);
    return this.platilloRepo.save(actualizado);
  }

  async remove(id: number): Promise<void> {
    const platillo = await this.findOne(id);
    await this.platilloRepo.remove(platillo);
  }
}
