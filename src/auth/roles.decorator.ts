import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/entitites/user.entity';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
