import { Controller, Post, Body, Get } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entitites/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ordenes')
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MESERO)
  create(@Body() dto: CreateOrdenDto) {
    return this.ordenesService.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MESERO, UserRole.COCINERO)
  findAll() {
    return this.ordenesService.findAll();
  }
}
