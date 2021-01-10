const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { db, FieldValue } = require('./init');
const collectionRef = db.collection('notifications');

const getNotifications = async () => {
  const snapshot = await collectionRef.orderBy('timestamp', 'desc').get();
  const results = [];
  snapshot.forEach(doc => {
    results.push({
      id: doc.id,
      title: doc.get('title'),
      shortDescription: doc.get('shortDescription'),
      description: doc.get('description'),
      timestamp: moment(doc.get('timestamp').toDate()).format(
        'yyyy-MM-DD hh:mm A'
      ),
    });
  });
  return results;
};

const saveNotifications = async (title, shortDescription, description) => {
  await collectionRef.doc(uuidv4()).set({
    title,
    shortDescription,
    description,
    timestamp: FieldValue.serverTimestamp(),
  });
  return;
};

const getDeviceTokens = async () => {
  const docRef = await db.collection('fcmTokens').doc('tokens').get();
  return docRef.get('data');
};

const saveDeviceToken = async token => {
  await db
    .collection('fcmTokens')
    .doc('tokens')
    .update({
      data: FieldValue.arrayUnion(token),
    });
  return;
};

module.exports = {
  getNotifications,
  saveNotifications,
  getDeviceTokens,
  saveDeviceToken,
};
