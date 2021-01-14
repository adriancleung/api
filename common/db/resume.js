const { db } = require('@db/init');
const { RESOURCE_NOT_FOUND, SUCCESS_CODE } = require('@constants');
const collectionRef = db.collection('data');

const getResume = async () => {
  const docRef = await collectionRef.doc('resume').get();
  if (!docRef.exists) {
    return { statusCode: RESOURCE_NOT_FOUND, body: 'Resume not found' };
  } else {
    return { statusCode: SUCCESS_CODE, body: docRef.get('src') };
  }
};

module.exports = {
  getResume,
};
