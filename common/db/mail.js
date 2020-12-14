const { SUCCESS_CODE, SERVER_ERROR } = require('../constants');
const { db, FieldValue } = require('./init');
const collectionRef = db.collection('mail');

const saveMail = async emailBody => {
  const docRef = await collectionRef.add({
    ...emailBody,
    created_at: FieldValue.serverTimestamp(),
  });
  if (docRef.id) {
    return SUCCESS_CODE;
  } else {
    return SERVER_ERROR;
  }
};

const getAllMail = async () => {
  const snapshot = await collectionRef.get();
  const results = [];
  snapshot.forEach(doc => {
    results.push(doc.data());
  });
  return results;
};

module.exports = {
  saveMail,
  getAllMail,
};
