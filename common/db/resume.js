const { db } = require('@db/init');
const {
  RESOURCE_NOT_FOUND,
  SERVER_ERROR,
  SUCCESS_CODE,
} = require('@constants');
const collectionRef = db.collection('data');

const getResume = async () => {
  const docRef = await collectionRef.doc('resume').get();
  if (!docRef.exists) {
    return { statusCode: RESOURCE_NOT_FOUND, body: 'Resume not found' };
  } else {
    return { statusCode: SUCCESS_CODE, body: docRef.get('src') };
  }
};

const updateResume = async encodedPDF => {
  try {
    await collectionRef.doc('resume').set({
      src: encodedPDF,
    });
    return { statusCode: SUCCESS_CODE, body: 'Resume updated' };
  } catch (err) {
    return { statusCode: SERVER_ERROR, body: 'Could not update resume' };
  }
};

module.exports = {
  getResume,
  updateResume,
};
