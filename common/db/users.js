const { v4: uuidv4 } = require('uuid');
const { db, FieldValue } = require('./init');
const collectionRef = db.collection('pushieUsers');
const { timestampCompare } = require('../util/compare');

const createUser = async (uid, email) => {
  await collectionRef.doc(uid).set({
    email,
    created_at: FieldValue.serverTimestamp(),
    token: '',
    notifications: [{}],
  });
  return;
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
      timestamp: FieldValue.serverTimestamp(),
    }),
  });
  return;
};

module.exports = {
  createUser,
  storeUserDeviceToken,
  getUserNotifications,
  storeUserNotifications,
};
