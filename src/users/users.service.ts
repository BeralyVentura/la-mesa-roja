import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './entitites/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name, role = UserRole.CLIENTE } = createUserDto;

    if (!email || !password || !name) {
      throw new BadRequestException(
        'Email, contraseña y nombre son requeridos',
      );
    }
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      role,
    });

    const savedUser = await this.userRepository.save(user);

    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword as User;
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find({
        select: ['id', 'email', 'name', 'role', 'isActive', 'createdAt'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException('No se encontraron usuarios');
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      // Validar ID
      if (!id || id <= 0) {
        throw new BadRequestException('ID de usuario inválido');
      }

      const user = await this.userRepository.findOne({
        where: { id },
        select: ['id', 'email', 'name', 'role', 'isActive', 'createdAt'],
      });

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      return user;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al buscar el usuario');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      if (!email) {
        throw new BadRequestException('Email es requerido');
      }

      return await this.userRepository.findOne({
        where: { email },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al buscar usuario por email',
      );
    }
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    try {
      if (!email) {
        throw new BadRequestException('Email es requerido');
      }

      return await this.userRepository.findOne({
        where: { email, isActive: true },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al buscar usuario con contraseña',
      );
    }
  }

  async findByRole(role: UserRole): Promise<User[]> {
    try {
      if (!role || !Object.values(UserRole).includes(role)) {
        throw new BadRequestException('Rol inválido');
      }

      return await this.userRepository.find({
        where: { role, isActive: true },
        select: ['id', 'email', 'name', 'role', 'isActive', 'createdAt'],
        order: { name: 'ASC' },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al buscar usuarios por rol',
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException('ID de usuario inválido');
      }

      const user = await this.findOne(id);

      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
      }

      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingEmail = await this.userRepository.findOne({
          where: { email: updateUserDto.email },
        });
        if (existingEmail) {
          throw new ConflictException('El email ya está en uso');
        }
      }
      const updateResult = await this.userRepository.update(id, updateUserDto);

      if (updateResult.affected === 0) {
        throw new InternalServerErrorException(
          'No se pudo actualizar el usuario',
        );
      }

      return this.findOne(id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  async remove(id: number): Promise<{ message: string; userId: number }> {
    try {
      // Validar ID
      if (!id || id <= 0) {
        throw new BadRequestException('ID de usuario inválido');
      }

      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      if (!user.isActive) {
        throw new BadRequestException('El usuario ya está desactivado');
      }

      const updateResult = await this.userRepository.update(id, {
        isActive: false,
      });

      if (updateResult.affected === 0) {
        throw new InternalServerErrorException(
          'No se pudo desactivar el usuario',
        );
      }

      return {
        message: 'Usuario desactivado exitosamente',
        userId: id,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al desactivar el usuario');
    }
  }

  async validateUser(id: number): Promise<User> {
    try {
      // Validar ID
      if (!id || id <= 0) {
        throw new BadRequestException('ID de usuario inválido');
      }

      const user = await this.userRepository.findOne({
        where: { id, isActive: true },
        select: ['id', 'email', 'name', 'role'],
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado o inactivo');
      }

      return user;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al validar el usuario');
    }
  }

  async reactivate(id: number): Promise<{ message: string; userId: number }> {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException('ID de usuario inválido');
      }

      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      if (user.isActive) {
        throw new BadRequestException('El usuario ya está activo');
      }

      const updateResult = await this.userRepository.update(id, {
        isActive: true,
      });

      if (updateResult.affected === 0) {
        throw new InternalServerErrorException(
          'No se pudo reactivar el usuario',
        );
      }

      return {
        message: 'Usuario reactivado exitosamente',
        userId: id,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al reactivar el usuario');
    }
  }
}
