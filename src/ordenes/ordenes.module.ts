import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenesService } from './ordenes.service';
import { OrdenesController } from './ordenes.controller';
import { Orden } from './orden.entity';
import { OrdenItem } from './orden-item.entity';
import { PromocionesModule } from 'src/promociones/promociones.module';
import { CocinaEventService } from 'src/cocina/events/cocina-event.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forFeature([Orden, OrdenItem]),
    PromocionesModule,
    EventEmitterModule.forRoot(), 
  ],
  controllers: [OrdenesController],
  providers: [OrdenesService],
  exports: [OrdenesService],
})
export class OrdenesModule {}