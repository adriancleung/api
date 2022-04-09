import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Role } from './role';

export type AuthenticatedRequest = Request & {
  userId: typeof uuidv4;
  email: string;
  role: Role;
};
