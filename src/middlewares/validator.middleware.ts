import { NextFunction, Request, Response } from 'express';
import {
  validationResult,
  ValidationChain,
  CustomValidator,
  Meta,
} from 'express-validator';
import app from '..';
import Mail from '../models/Mail';
import Notification from '../models/Notification';
import User from '../models/User';
import { ApiResponseCode } from '../types/response';

const split = thing => {
  if (typeof thing === 'string') {
    return thing.split('/');
  } else if (thing.fast_slash) {
    return '';
  } else {
    var match = thing
      .toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
    return match
      ? match[1].replace(/\\(.)/g, '$1').split('/')
      : '<complex:' + thing.toString() + '>';
  }
};

const isValidRoute = async (
  routeToCheck: string,
  { req }: Meta
): Promise<CustomValidator> => {

  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      const route = split(middleware.regexp);
    }
  })

  return;
};

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
    include: { model: User.scope('limited'), as: 'user' },
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

    res.status(ApiResponseCode.CLIENT_ERROR).json({ errors: errors.array() });
  };
};

export {
  isValidRoute,
  isValidUser,
  mailExists,
  notificationExists,
  userExists,
  validate,
};
