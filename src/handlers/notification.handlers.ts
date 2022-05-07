import Notification from '../models/Notification';
import User from '../models/User';
import { admin } from '../services/firebase.services';

const createAndSendUserNotification = async (
  userId: string,
  title: string,
  shortDescription: string,
  description?: string,
  labels?: string[]
) => {
  try {
    const user = await User.findByPk(userId);
    const notification = await Notification.create({
      title: title,
      shortDescription: shortDescription,
      ...(description && { description: description }),
      ...(labels && { labels: labels }),
    });
    await user.addNotification(notification);
    await sendNotification(user.tokens, notification);
  } catch (err) {
    console.error('Could not create and send notification', err);
  }
};

const sendNotification = async (
  tokens: string[],
  notification: Notification
) => {
  try {
    await admin.messaging().sendMulticast({
      notification: {
        title: notification.title,
        body: notification.shortDescription,
      },
      tokens: tokens,
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
            sound: 'default',
          },
        },
        headers: {
          'apns-priority': '5',
          'apns-topic': 'com.adriancleung.pushie',
        },
      },
    });
  } catch (err) {
    console.error(err);
  }
};

export { createAndSendUserNotification, sendNotification };
