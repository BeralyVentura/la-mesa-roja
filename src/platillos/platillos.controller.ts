import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PlatillosService } from './platillos.service';
import { CreatePlatilloDto } from './dto/create-platillo.dto';
import { UpdatePlatilloDto } from './dto/update-platillo.dto';

@Controller('platillos')
export class PlatillosController {
  constructor(private readonly platillosService: PlatillosService) {}

  @Post()
  create(@Body() dto: CreatePlatilloDto) {
    return this.platillosService.create(dto);
  }

  @Get()
  findAll() {
    return this.platillosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.platillosService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlatilloDto) {
    return this.platillosService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.platillosService.remove(+id);
  }
}
