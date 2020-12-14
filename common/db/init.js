const admin = require('firebase-admin');
const FieldValue = admin.firestore.FieldValue;

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.firebase_service_account_dev)
  ),
  databaseURL: process.env.databaseURL,
});

const db = admin.firestore();

module.exports = {
  db,
  FieldValue,
};
