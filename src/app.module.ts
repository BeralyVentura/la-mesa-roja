import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlatillosModule } from './platillos/platillos.module';
import { PromocionesModule } from './promociones/promociones.module';
import { OrdenesModule } from './ordenes/ordenes.module'; // solo si usa su servicio
import { FacturaModule } from './factura/factura.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'restaurante',
      autoLoadEntities: true,
      synchronize: true,
    }),
    PlatillosModule,
    PromocionesModule,
    OrdenesModule,
    FacturaModule, 
  ],
})
export class AppModule {}
