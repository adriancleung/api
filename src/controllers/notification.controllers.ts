import { Response } from 'express';
import Notification from '../models/Notification';
import User from '../models/User';
import {
  AuthenticatedRequest,
  NotificationRequest,
  UserRequest,
} from '../types/request';
import { ApiResponseCode } from '../types/response';

import { sendNotification } from '../handlers/notification.handlers';

const addUserNotification = async (
  req: AuthenticatedRequest & UserRequest,
  res: Response
) => {
  const { title, shortDescription, description } = req.body;
  try {
    const notification = await Notification.create({
      title: title,
      shortDescription: shortDescription,
      description: description,
    });
    await req.user.addNotification(notification);
    if (req.user.tokens) {
      sendNotification(req.user.tokens, notification);
    }
    res.status(ApiResponseCode.SUCCESS).send({ notification: notification });
    return;
  } catch (err) {
    console.error(err);
    res.status(ApiResponseCode.SERVER_ERROR).send({ message: err });
    return;
  }
};

const deleteUserNotification = async (
  req: AuthenticatedRequest & NotificationRequest,
  res: Response
) => {
  try {
    await req.notification.destroy();
  } catch (err) {
    console.error(err);
    res.status(ApiResponseCode.SERVER_ERROR).send({ message: err });
    return;
  }
  res.sendStatus(ApiResponseCode.SUCCESS);
};

const editUserNotification = async (
  req: AuthenticatedRequest & NotificationRequest,
  res: Response
) => {
  const { title, shortDescription, description } = req.body;
  try {
    const notification = await req.notification.update({
      ...(title && { title: title }),
      ...(shortDescription && { shortDescription: shortDescription }),
      ...(description && { description: description }),
    });
    res.status(ApiResponseCode.SUCCESS).send({ notification: notification });
    return;
  } catch (err) {
    console.error(err);
    res.status(ApiResponseCode.SERVER_ERROR).send({ message: err });
    return;
  }
};

const getUserNotification = async (
  req: AuthenticatedRequest & NotificationRequest,
  res: Response
) => {
  res.status(ApiResponseCode.SUCCESS).send({ notification: req.notification });
};

const getUserNotifications = async (
  req: AuthenticatedRequest & UserRequest,
  res: Response
) => {
  const notifications = await req.user.getNotifications({
    include: { model: User, as: 'user' },
  });
  res.status(ApiResponseCode.SUCCESS).send({ notifications: notifications });
};

export {
  addUserNotification,
  deleteUserNotification,
  editUserNotification,
  getUserNotification,
  getUserNotifications,
};
