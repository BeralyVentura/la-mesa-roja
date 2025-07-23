import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orden } from './orden.entity';
import { OrdenItem } from './orden-item.entity';
import { OrdenesService } from './ordenes.service';
import { OrdenesController } from './ordenes.controller';
import { PromocionesModule } from '../promociones/promociones.module'; // 👈 importante

@Module({
  imports: [
    TypeOrmModule.forFeature([Orden, OrdenItem]), // 👈 necesario para inyectar repositorios
    PromocionesModule, // 👈 importar porque usa PromocionesService
  ],
  controllers: [OrdenesController],
  providers: [OrdenesService],
})
export class OrdenesModule {}
