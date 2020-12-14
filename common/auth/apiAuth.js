const { SUCCESS_CODE, UNAUTHORIZED, SERVER_ERROR } = require('../constants');
const { getApiKey } = require('../db/api');

const validateAuth = (req, res, next) => {
  if (req.secure && req.headers['x-api-key']) {
    getApiKey(req.headers['x-api-key'])
      .then(value => {
        if (value.statusCode === SUCCESS_CODE) {
          next();
        } else {
          res.sendStatus(UNAUTHORIZED);
        }
      })
      .catch(() => {
        res.sendStatus(SERVER_ERROR);
      });
  } else {
    res.sendStatus(UNAUTHORIZED);
  }
};

module.exports = {
  validateAuth,
};
