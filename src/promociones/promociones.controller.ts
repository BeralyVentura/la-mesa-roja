import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { PromocionesService } from './promociones.service';
import { CreatePromocionDto } from './dto/create-promocion.dto';
import { UpdatePromocionDto } from './dto/update-promocion.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entitites/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('promociones')
export class PromocionesController {
  constructor(private readonly service: PromocionesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreatePromocionDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MESERO)
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdatePromocionDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Get('/activas/buscar')
  @Roles(UserRole.ADMIN, UserRole.MESERO, UserRole.COCINERO, UserRole.CLIENTE)
  findActivas(
    @Query('usuario') usuario: string,
    @Query('categoria') categoria: string,
  ) {
    return this.service.findActivePromotions(usuario, categoria);
  }
}
