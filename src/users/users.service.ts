import { Injectable } from '@nestjs/common';
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

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      role,
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'email', 'name', 'role', 'isActive', 'createdAt'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'role', 'isActive', 'createdAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email, isActive: true },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email is already in use');
      }
    }

    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }

    if (!user.isActive) {
      throw new BadRequestException('El usuario ya está desactivado');
    }

    await this.userRepository.update(id, { isActive: false });

    return { message: 'Usuario desactivado exitosamente' };
  }

  async validateUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
      select: ['id', 'email', 'name', 'role'],
    });

    if (!user) {
      throw new NotFoundException('User not found or inactive');
    }

    return user;
  }
}
