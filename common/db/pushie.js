const { v4: uuidv4 } = require('uuid');
const { db, FieldValue, Timestamp } = require('@db/init');
const { getDateTimeFromTimestamp } = require('@util/dateTime');
const { timestampCompare } = require('@util/compare');
const collectionRef = db.collection('pushie');

const createUser = async (uid, email) => {
  await collectionRef.doc(uid).set({
    email,
    created_at: FieldValue.serverTimestamp(),
    token: '',
    notifications: [],
  });
  return;
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

module.exports = {
  createUser,
  getUserDeviceToken,
  storeUserDeviceToken,
  getUserNotifications,
  storeUserNotifications,
};
