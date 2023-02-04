import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Mail from '../models/Mail';
import Notification from '../models/Notification';
import User from '../models/User';
import { RoleType } from './role';

export type AuthenticatedRequest = Request & {
  userId: typeof uuidv4;
  email: string;
  role: RoleType;
};

export type MailRequest = Request & {
  mail: Mail;
};

export type NotificationRequest = UserRequest & {
  notification: Notification;
};

export type PaginationRequest = Request & {
  offset: number;
  limit: number;
};

export type UserRequest = Request & {
  user: User;
};

export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
