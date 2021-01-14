const { db } = require('@db/init');
const { RESOURCE_NOT_FOUND, SUCCESS_CODE } = require('@constants');
const collectionRef = db.collection('users');

const createUser = async (username, password) => {
  await collectionRef.doc(username).set({
    username: username,
    password: password,
  });
  return;
};

const getUser = async username => {
  const docRef = await collectionRef.doc(username).get();
  if (!docRef.exists) {
    return {
      statusCode: RESOURCE_NOT_FOUND,
      id: null,
      body: { message: 'User not found' },
    };
  } else {
    return { statusCode: SUCCESS_CODE, id: docRef.id, body: docRef.data() };
  }
};

module.exports = {
  createUser,
  getUser,
};
