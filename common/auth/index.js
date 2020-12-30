const { SUCCESS_CODE, FORBIDDEN } = require('../constants');
const { verifyApiKey } = require('./apiKeyAuth');
const { verifyJwt } = require('./jwtAuth');

const checkAuthorization = (req, res, next) => {
  if (req.headers['x-access-token']) {
    verifyJwt(req.headers['x-access-token']).then(value => {
      if (value.statusCode === SUCCESS_CODE) {
        req.userId = value.body.userId;
        next();
      } else {
        res.status(value.statusCode).send(value.body);
      }
    });
  } else if (req.headers['x-api-key']) {
    verifyApiKey().then(value => {
      if (value.statusCode === SUCCESS_CODE) {
        req.userId = value.id;
        next();
      } else {
        res.status(value.statusCode).send(value.body);
      }
    });
  } else {
    res
      .status(FORBIDDEN)
      .send({ userId: null, message: 'Requires authentication' });
  }
};

module.exports = {
  checkAuthorization,
};
