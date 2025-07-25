import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entitites/user.entity';
import { UsersModule } from './users/users.module';
import { PlatillosModule } from './platillos/platillos.module';
import { PromocionesModule } from './promociones/promociones.module';
import { OrdenesModule } from './ordenes/ordenes.module'; // solo si usa su servicio
import { FacturaModule } from './factura/factura.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Factura } from './factura/factura.entity';
import { Platillo } from './platillos/platillo.entity';
import { Promocion } from './promociones/promocion.entity';
import { Orden } from './ordenes/orden.entity';
import { OrdenItem } from './ordenes/orden-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Factura, Orden, OrdenItem, Platillo, Promocion],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    PlatillosModule,
    PromocionesModule,
    OrdenesModule,
    FacturaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
