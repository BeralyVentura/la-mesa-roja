import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter'; 
import { AuthModule } from './auth/auth.module';
import { User } from './users/entitites/user.entity';
import { UsersModule } from './users/users.module';
import { PlatillosModule } from './platillos/platillos.module';
import { PromocionesModule } from './promociones/promociones.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { FacturaModule } from './factura/factura.module';
import { CocinaModule } from './cocina/cocina.module'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Factura } from './factura/factura.entity';
import { Platillo } from './platillos/platillo.entity';
import { Promocion } from './promociones/promocion.entity';
import { Orden } from './ordenes/orden.entity';
import { OrdenItem } from './ordenes/orden-item.entity';
import { NotificacionCocina } from './cocina/entities/notificacion-cocina.entity'; 
import { HistorialEstado } from './cocina/entities/historial-estado.entity'; 
import { Mesa } from './mesa/mesa.entity';
import { MesaModule } from './mesa/mesa.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User, 
        Factura, 
        Orden, 
        Platillo, 
        Promocion, 
        OrdenItem,
        NotificacionCocina,  
        HistorialEstado,   
        Mesa  
      ],
      synchronize: true, 
      logging: false, 
    }),
    
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }), 
    
    AuthModule,
    UsersModule,
    PlatillosModule,
    PromocionesModule,
    OrdenesModule,
    FacturaModule,
    CocinaModule,  
    MesaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}