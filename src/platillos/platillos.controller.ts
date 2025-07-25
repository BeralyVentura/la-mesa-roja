import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PlatillosService } from './platillos.service';
import { CreatePlatilloDto } from './dto/create-platillo.dto';
import { UpdatePlatilloDto } from './dto/update-platillo.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entitites/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Platillos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('platillos')
export class PlatillosController {
  constructor(private readonly platillosService: PlatillosService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo platillo' })
  @ApiResponse({ status: 201, description: 'Platillo creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'Sin permisos de administrador' })
  create(@Body() createPlatilloDto: CreatePlatilloDto) { 
    return this.platillosService.create(createPlatilloDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MESERO, UserRole.COCINERO, UserRole.CLIENTE)
  @ApiOperation({ summary: 'Obtener todos los platillos' })
  findAll() {
    return this.platillosService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MESERO, UserRole.COCINERO, UserRole.CLIENTE)
  @ApiOperation({ summary: 'Obtener un platillo por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) { 
    return this.platillosService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar un platillo' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updatePlatilloDto: UpdatePlatilloDto,
  ) {
    return this.platillosService.update(id, updatePlatilloDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar un platillo' })
  remove(@Param('id', ParseIntPipe) id: number) { 
    return this.platillosService.remove(id);
  }
}