import { NextFunction, Request, Response } from 'express';
import {
  validationResult,
  ValidationChain,
  CustomValidator,
  Meta,
} from 'express-validator';
import Mail from '../models/Mail';
import Notification from '../models/Notification';
import User from '../models/User';

const isValidUser = async (
  email: string,
  { req }: Meta
): Promise<CustomValidator> => {
  const user = await User.findOne({ where: { email: email } });
  if (user !== null) {
    return Promise.reject('E-mail already in use');
  }
  req.user = user;
};

const mailExists = async (
  mailId: string,
  { req }: Meta
): Promise<CustomValidator> => {
  const mail = await Mail.findByPk(mailId);
  if (mail === null) {
    return Promise.reject('Mail does not exist');
  }
  req.mail = mail;
};

const notificationExists = async (
  notificationId: string,
  { req }: Meta
): Promise<CustomValidator> => {
  const notification = await Notification.findByPk(notificationId, {
    include: { model: User, as: 'user' },
  });
  if (notification === null || req.params.user_id !== notification.user.id) {
    return Promise.reject('Notification does not exist');
  }
  req.notification = notification;
};

const userExists = async (
  userId: string,
  { req }: Meta
): Promise<CustomValidator> => {
  const user = await User.findByPk(userId);
  if (user === null) {
    return Promise.reject('User does not exist');
  }
  req.user = user;
};

const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

export { isValidUser, mailExists, notificationExists, userExists, validate };
