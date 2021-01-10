const { admin } = require('../../db/init');
const {
  getDeviceTokens,
  saveNotifications,
} = require('../../db/notifications');
const { SUCCESS_CODE, SERVER_ERROR } = require('../../constants');
const { errorMsg } = require('../../util/error');

const notify = async (title, shortDescription, description) => {
  try {
    await saveNotifications(title, shortDescription, description);
    const tokens = await getDeviceTokens();
    await admin.messaging().sendMulticast({
      notification: {
        title: title,
        body: shortDescription,
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
    return SUCCESS_CODE;
  } catch (err) {
    return errorMsg(SERVER_ERROR, 'Could not send push notification', err);
  }
};

module.exports = {
  notify,
};
