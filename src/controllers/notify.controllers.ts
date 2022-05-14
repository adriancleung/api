import { Response } from 'express';
import { sendNotification } from '../handlers/notification.handlers';
import Notification from '../models/Notification';
import User from '../models/User';
import { AuthenticatedRequest } from '../types/request';
import { ApiResponseCode } from '../types/response';

const addAndSendUserNotification = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { title, shortDescription, description, label } = req.body;
  const user = await User.findByPk(req.userId as unknown as string);
  if (user === null) {
    res.sendStatus(ApiResponseCode.RESOURCE_NOT_FOUND);
    return;
  }
  try {
    const notification = await Notification.create({
      title: title,
      shortDescription: shortDescription,
      ...(description && { description: description }),
      ...(label && { labels: label }),
    });
    await user.addNotification(notification);
    if (user.tokens) {
      sendNotification(user.tokens, notification);
    }
    res.status(ApiResponseCode.SUCCESS).send({ notification: notification });
  } catch (err) {
    console.error(err);
    res.status(ApiResponseCode.SERVER_ERROR).send({ message: err });
    return;
  }
};

export { addAndSendUserNotification };
