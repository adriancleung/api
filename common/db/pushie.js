const { v4: uuidv4 } = require('uuid');
const { db, FieldValue, Timestamp } = require('@db/init');
const { getDateTimeFromTimestamp } = require('@util/dateTime');
const { timestampCompare } = require('@util/compare');
const { encode } = require('@util/encode');
const { SUCCESS_CODE } = require('@constants');
const collectionRef = db.collection('pushie');

const createUser = async (uid, email) => {
  const apiKey = encode(uuidv4().replace(/-/g, ''));
  await collectionRef.doc(uid).set({
    apiKey,
    createdAt: FieldValue.serverTimestamp(),
    email,
    token: '',
    notifications: [],
  });
  return apiKey;
};

const getUserDeviceToken = async uid => {
  const docRef = await collectionRef.doc(uid).get();
  return docRef.get('token');
};

const storeUserDeviceToken = async (uid, token) => {
  await collectionRef.doc(uid).update({
    token,
  });
};

const getUserNotifications = async uid => {
  const docRef = await collectionRef.doc(uid).get();
  const results = docRef.get('notifications');
  results.sort(timestampCompare);
  results.forEach(value => {
    value.timestamp = getDateTimeFromTimestamp(value.timestamp);
  });
  return results;
};

const storeUserNotifications = async (
  uid,
  title,
  shortDescription,
  description
) => {
  await collectionRef.doc(uid).update({
    notifications: FieldValue.arrayUnion({
      id: uuidv4(),
      title,
      shortDescription,
      description,
      timestamp: Timestamp.now(),
    }),
  });
  return;
};

const deleteUserNotification = async (uid, item) => {
  try {
    const docRef = collectionRef.doc(uid);
    const results = await docRef.update({
      notifications: FieldValue.arrayRemove({
        id: item.id,
        title: item.title,
        shortDescription: item.shortDescription,
        description: item.description,
        timestamp: Timestamp.fromDate(new Date(item.timestamp)),
      }),
    });
    console.log(results);
    return SUCCESS_CODE;
  } catch (err) {
    throw new Error(err);
  }
};

const getUserApiKey = async uid => {
  const docRef = await collectionRef.doc(uid).get();
  return docRef.get('apiKey');
};

const searchForUID = async (field, value) => {
  const user = await collectionRef.where(field, '==', value).get();
  if (user.empty) {
    return;
  }
  const docRef = user.docs[0];
  return docRef.id;
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
