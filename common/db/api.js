const { RESOURCE_NOT_FOUND, SUCCESS_CODE } = require('../constants');
const { db, FieldValue } = require('./init');
const collectionRef = db.collection('apiKeys');

const getAllApiKeys = async () => {
  const snapshot = await collectionRef.get();
  const results = [];
  snapshot.forEach(doc => {
    results.push(doc.id);
  });
  return results;
};

const addApiKey = async apiKey => {
  await collectionRef.doc(apiKey).set({
    iat: FieldValue.serverTimestamp(),
  });
  return;
};

const getApiKey = async apiKey => {
  const docRef = await collectionRef.doc(apiKey).get();
  if (!docRef.exists) {
    return { statusCode: RESOURCE_NOT_FOUND, body: 'Api key not found' };
  } else {
    return { statusCode: SUCCESS_CODE, body: docRef.data() };
  }
};

module.exports = {
  getAllApiKeys,
  addApiKey,
  getApiKey,
};
