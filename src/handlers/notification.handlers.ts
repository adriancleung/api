import Notification from '../models/Notification';
import { admin } from '../services/firebase.services';

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

export { sendNotification };
