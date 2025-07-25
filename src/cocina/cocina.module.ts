import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CocinaController } from './cocina.controller';
import { CocinaService } from './cocina.service';
import { CocinaEventService } from './events/cocina-event.service';
import { CocinaEventListener } from './listeners/cocina-event.listener';
import { NotificacionCocina } from './entities/notificacion-cocina.entity';
import { HistorialEstado } from './entities/historial-estado.entity';
import { Orden } from 'src/ordenes/orden.entity';
import { User } from 'src/users/entitites/user.entity';
import { OrdenesModule } from 'src/ordenes/ordenes.module';
import { OrdenCreatedListener } from './listeners/orden-created.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificacionCocina,
      HistorialEstado,
      Orden,
      User,
    ]),
    EventEmitterModule.forRoot(),
    OrdenesModule,
  ],
  controllers: [CocinaController],
  providers: [
    CocinaService,
    CocinaEventService,
    CocinaEventListener,
    OrdenCreatedListener, 
  ],
  exports: [CocinaService, CocinaEventService],
})
export class CocinaModule {}