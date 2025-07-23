import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatillosService } from './platillos.service';
import { PlatillosController } from './platillos.controller';
import { Platillo } from './platillo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Platillo])],
  controllers: [PlatillosController],
  providers: [PlatillosService],
})
export class PlatillosModule {}
