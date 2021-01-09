const { db } = require('./init');
const { RESOURCE_NOT_FOUND, SUCCESS_CODE } = require('../constants');
const collectionRef = db.collection('data');

const getAboutContent = async () => {
  const docRef = await collectionRef.doc('about').get();
  if (!docRef.exists) {
    return { statusCode: RESOURCE_NOT_FOUND, body: 'Resource not found' };
  } else {
    return { statusCode: SUCCESS_CODE, body: docRef.get('src') };
  }
};

module.exports = {
  getAboutContent,
};
