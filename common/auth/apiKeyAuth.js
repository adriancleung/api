const { SERVER_ERROR } = require('@constants');
const { getApiKey } = require('@db/api');

const verifyApiKey = async apiKey => {
  try {
    const value = await getApiKey(apiKey);
    return value;
  } catch (err) {
    return {
      statusCode: SERVER_ERROR,
      body: { id: null, message: 'Server error' },
    };
  }
};

module.exports = {
  verifyApiKey,
};
