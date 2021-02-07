const admin = require('firebase-admin');
const FieldValue = admin.firestore.FieldValue;
const Timestamp = admin.firestore.Timestamp;
const arrayRemove = admin.firestore.FieldValue.arrayRemove;

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.firebase_service_account_dev)
  ),
  databaseURL: process.env.databaseURL,
});

const db = admin.firestore();

module.exports = {
  admin,
  db,
  FieldValue,
  Timestamp,
  arrayRemove,
};
