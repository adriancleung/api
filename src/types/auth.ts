import { v4 as uuidv4 } from 'uuid';
import { RoleType } from './role';

export enum AuthType {
  JWT = 'authorization',
  API = 'x-api-key',
}

export interface JwtPayload {
  userId: typeof uuidv4;
  email: string;
  role: RoleType;
}
