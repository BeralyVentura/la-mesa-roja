import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura } from './factura.entity';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { Orden } from 'src/ordenes/orden.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Factura, Orden])],
  providers: [FacturaService],
  controllers: [FacturaController],
})
export class FacturaModule {}
