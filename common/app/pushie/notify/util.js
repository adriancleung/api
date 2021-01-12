const { admin } = require('../../../db/init');
const { storeUserNotifications } = require('../../../db/pushie');

const notify = async (uid, token, title, shortDescription, decription) => {
  try {
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
