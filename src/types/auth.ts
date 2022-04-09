import { v4 as uuidv4 } from 'uuid';
import { Role } from './role';

export enum AuthType {
  JWT = 'x-access-token',
  API = 'x-api-key',
  PUSHIE_JWT = 'authorization',
  PUSHIE_API = 'pushie-api-key',
}

export interface JwtPayload {
  userId: typeof uuidv4;
  email: string;
  role: Role;
}
