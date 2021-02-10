const { SUCCESS_CODE, UNAUTHORIZED } = require('@constants');
const { verifyApiKey } = require('@auth/apiKeyAuth');
const { verifyJwt } = require('@auth/jwtAuth');
const {
  verifyIdToken,
  verifyApiKey: verifyPushieApiKey,
} = require('@auth/pushieAuth');

const checkAuthorization = (req, res, next) => {
  if (req.headers['x-access-token']) {
    verifyJwt(req.headers['x-access-token'])
      .then(value => {
        if (value.statusCode === SUCCESS_CODE) {
          req.userId = value.body.userId;
          next();
        } else {
          res.status(value.statusCode).send(value.body);
        }
      })
      .catch(err =>
        res
          .status(SERVER_ERROR)
          .send(errorMsg(SERVER_ERROR, 'Error authenticating user', err))
      );
  } else if (req.headers['x-api-key']) {
    verifyApiKey()
      .then(value => {
        if (value.statusCode === SUCCESS_CODE) {
          req.userId = value.id;
          next();
        } else {
          res.status(value.statusCode).send(value.body);
        }
      })
      .catch(err =>
        res
          .status(SERVER_ERROR)
          .send(errorMsg(SERVER_ERROR, 'Error authenticating user', err))
      );
  } else if (req.headers['authorization']) {
    const token = req.headers['authorization'].split(' ')[1];
    if (token === undefined) {
      res
        .status(UNAUTHORIZED)
        .send({ uid: null, message: 'Authorization header invalid' });
    } else {
      verifyIdToken(token)
        .then(value => {
          if (value.statusCode === SUCCESS_CODE) {
            req.uid = value.body.uid;
            next();
          } else {
            res.status(value.statusCode).send(value.body);
          }
        })
        .catch(err =>
          res
            .status(SERVER_ERROR)
            .send(errorMsg(SERVER_ERROR, 'Error authenticating user', err))
        );
    }
  } else if (req.headers['pushie-api-key']) {
    verifyPushieApiKey(req.headers['pushie-api-key'])
      .then(value => {
        if (value.statusCode === SUCCESS_CODE) {
          req.uid = value.body.uid;
          next();
        } else {
          res.status(value.statusCode).send(value.body);
        }
      })
      .catch(err =>
        res
          .status(SERVER_ERROR)
          .send(errorMsg(SERVER_ERROR, 'Error authenticating user', err))
      );
  } else {
    res
      .status(UNAUTHORIZED)
      .send({ userId: null, message: 'Requires authentication' });
  }
};

module.exports = {
  checkAuthorization,
};
