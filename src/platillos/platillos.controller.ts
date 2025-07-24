import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PlatillosService } from './platillos.service';
import { CreatePlatilloDto } from './dto/create-platillo.dto';
import { UpdatePlatilloDto } from './dto/update-platillo.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entitites/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('platillos')
export class PlatillosController {
  constructor(private readonly platillosService: PlatillosService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreatePlatilloDto) {
    return this.platillosService.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MESERO, UserRole.COCINERO, UserRole.CLIENTE)
  findAll() {
    return this.platillosService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MESERO, UserRole.COCINERO, UserRole.CLIENTE)
  findOne(@Param('id') id: string) {
    return this.platillosService.findOne(+id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdatePlatilloDto) {
    return this.platillosService.update(+id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.platillosService.remove(+id);
  }
}
