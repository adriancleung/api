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
      tokens: [],
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
    return docRef.get('tokens');
  } catch (err) {
    console.error(err);
    throw new Error(`${err.name}: ${err.message}`);
  }
};

const storeUserDeviceToken = async (uid, token) => {
  try {
    await collectionRef.doc(uid).update({
      tokens: FieldValue.arrayUnion(token),
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
    throw new Error('Notification title is missing. Please provide a title.');
  }
  if (shortDescription === undefined) {
    throw new Error(
      'Notification short description is missing. Please provide a short desciption.'
    );
  }
  if (label && label.length > 30) {
    throw new Error(
      'Label cannot be longer than 30 characters. Please shorten your label name.'
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
        label: label ? label : null,
        timestamp,
      }),
    });
    return {
      id,
      title,
      shortDescription,
      description,
      label,
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
        label: item.label,
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

const refreshApiKey = async uid => {
  let apiKey;
  while (true) {
    apiKey = encode(uuidv4().replace(/-/g, ''));
    try {
      const results = await searchForUID('apiKey', apiKey);
      if (!results) {
        break;
      }
    } catch (err) {
      console.error(err);
      throw new Error(`${err.name}: ${err.message}`);
    }
  }
  try {
    const docRef = collectionRef.doc(uid);
    await docRef.update({
      apiKey: apiKey,
    });
    return apiKey;
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
  refreshApiKey,
  searchForUID,
};
