const { admin } = require('@db/init');
const { storeUserNotifications, getUserDeviceToken } = require('@db/pushie');

const notify = async (uid, title, shortDescription, decription) => {
  try {
    const token = await getUserDeviceToken(uid);
    await storeUserNotifications(uid, title, shortDescription, decription);
    await admin.messaging().send({
      notification: {
        title: title,
        body: shortDescription,
      },
      token: token,
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
    throw Error(err);
  }
};

module.exports = {
  notify,
};
