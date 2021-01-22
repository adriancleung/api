const { admin } = require('@db/init');
const { searchForUID } = require('@db/pushie');
const { SUCCESS_CODE, FORBIDDEN } = require('@constants');

const verifyIdToken = token => {
  return admin
    .auth()
    .verifyIdToken(token)
    .then(decodedIdToken => {
      return {
        statusCode: SUCCESS_CODE,
        body: { uid: decodedIdToken.uid, message: 'Authorized' },
      };
    });
};

const verifyApiKey = apiKey => {
  return searchForUID('apiKey', apiKey).then(value => {
    if (value === undefined) {
      return {
        statusCode: FORBIDDEN,
        body: { uid: null, message: 'Forbidden API Key' },
      };
    } else {
      return {
        statusCode: SUCCESS_CODE,
        body: { uid: value, message: 'Authorized' },
      };
    }
  });
};

module.exports = {
  verifyIdToken,
  verifyApiKey,
};
