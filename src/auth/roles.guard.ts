import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/users/entitites/user.entity';
import { User } from 'src/users/entitites/user.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    // Verificar que el usuario existe y tiene rol
    if (!user || !user.role) {
      return false;
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
