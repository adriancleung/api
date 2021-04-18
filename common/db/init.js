const admin = require('firebase-admin');
const FieldValue = admin.firestore.FieldValue;
const Timestamp = admin.firestore.Timestamp;

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.firebase_service_account_dev)
  ),
  databaseURL: process.env.databaseURL,
});

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

module.exports = {
  admin,
  db,
  FieldValue,
  Timestamp,
};
