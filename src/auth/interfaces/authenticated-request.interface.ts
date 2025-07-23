import { Request } from 'express';
import { User } from 'src/users/entitites/user.entity';

export interface AuthenticatedRequest extends Request {
  user: User;
}
