const { db } = require('@db/init');
const { RESOURCE_NOT_FOUND, SUCCESS_CODE } = require('@constants');
const collectionRef = db.collection('data');

const getAboutContent = async () => {
  const docRef = await collectionRef.doc('about').get();
  if (!docRef.exists) {
    return { statusCode: RESOURCE_NOT_FOUND, body: 'Resource not found' };
  } else {
    return { statusCode: SUCCESS_CODE, body: docRef.get('src') };
  }
};

const updateAboutContent = async content => {
  try {
    await collectionRef.doc('about').set({
      src: content,
    });
    return { statusCode: SUCCESS_CODE, body: 'About content updated' };
  } catch (err) {
    return { statusCode: SERVER_ERROR, body: 'Could not update about content' };
  }
};

module.exports = {
  getAboutContent,
  updateAboutContent,
};
