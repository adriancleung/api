const { v4: uuidv4 } = require('uuid');
const { db, FieldValue, Timestamp } = require('@db/init');
const { getDateTimeFromTimestamp } = require('@util/dateTime');
const { timestampCompare } = require('@util/compare');
const { encode } = require('@util/encode');
const collectionRef = db.collection('pushie');

const createUser = async (uid, email) => {
  const apiKey = encode(uuidv4().replace(/-/g, ''));
  try {
    await collectionRef.doc(uid).set({
      apiKey,
      createdAt: FieldValue.serverTimestamp(),
      email,
      token: '',
      notifications: [],
    });
    return apiKey;
  } catch (err) {
    console.error(err);
    throw new Error(`${err.name}: ${err.message}`);
  }
};

const getUserDeviceToken = async uid => {
  try {
    const docRef = await collectionRef.doc(uid).get();
    return docRef.get('token');
  } catch (err) {
    console.error(err);
    throw new Error(`${err.name}: ${err.message}`);
  }
};

const storeUserDeviceToken = async (uid, token) => {
  try {
    await collectionRef.doc(uid).update({
      token,
    });
  } catch (err) {
    console.error(err);
    throw new Error(`${err.name}: ${err.message}`);
  }
};

const getUserNotifications = async uid => {
  try {
    const docRef = await collectionRef.doc(uid).get();
    const results = docRef.get('notifications');
    results.sort(timestampCompare);
    results.forEach(value => {
      value.timestamp = getDateTimeFromTimestamp(value.timestamp);
    });
    return results;
  } catch (err) {
    console.error(err);
    throw new Error(`${err.name}: ${err.message}`);
  }
};

const storeUserNotifications = async (
  uid,
  title,
  shortDescription,
  description
) => {
  if (title === undefined) {
    throw new Error('Notification title is missing. Please provide a title');
  } else if (shortDescription === undefined) {
    throw new Error(
      'Notification short description is missing. Please provide a short desciption'
    );
  }
  try {
    const id = uuidv4();
    const timestamp = Timestamp.now();
    await collectionRef.doc(uid).update({
      notifications: FieldValue.arrayUnion({
        id,
        title,
        shortDescription,
        description: description ? description : null,
        timestamp,
      }),
    });
    return {
      id,
      title,
      shortDescription,
      description,
      timestamp: getDateTimeFromTimestamp(timestamp),
    };
  } catch (err) {
    console.error(err);
    throw new Error(`${err.name}: ${err.message}`);
  }
};

const deleteUserNotification = async (uid, item) => {
  try {
    const docRef = collectionRef.doc(uid);
    await docRef.update({
      notifications: FieldValue.arrayRemove({
        id: item.id,
        title: item.title,
        shortDescription: item.shortDescription,
        description: item.description,
        timestamp: Timestamp.fromDate(new Date(item.timestamp)),
      }),
    });
  } catch (err) {
    console.error(err);
    throw new Error(`${err.name}: ${err.message}`);
  }
};

const getUserApiKey = async uid => {
  try {
    const docRef = await collectionRef.doc(uid).get();
    return docRef.get('apiKey');
  } catch (err) {
    console.error(err);
    throw new Error(`${err.name}: ${err.message}`);
  }
};

const searchForUID = async (field, value) => {
  try {
    const user = await collectionRef.where(field, '==', value).get();
    if (user.empty) {
      return;
    }
    const docRef = user.docs[0];
    return docRef.id;
  } catch (err) {
    console.error(err);
    throw new Error(`${err.name}: ${err.message}`);
  }
};

module.exports = {
  createUser,
  getUserDeviceToken,
  storeUserDeviceToken,
  getUserNotifications,
  storeUserNotifications,
  deleteUserNotification,
  getUserApiKey,
  searchForUID,
};
