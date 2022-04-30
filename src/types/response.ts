import { v4 as uuidv4 } from 'uuid';
import { Role } from './role';

export enum ApiResponseCode {
  SUCCESS = 200,
  CLIENT_ERROR = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  RESOURCE_NOT_FOUND = 404,
  SERVER_ERROR = 500,
  SERVER_UNAVAILABLE = 503,
}

export type ApiResponse = {
  statusCode: ApiResponseCode;
  body: {
    userId?: typeof uuidv4;
    email?: string;
    accessToken?: string;
    role?: Role;
    message: string;
  };
};
