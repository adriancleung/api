const {
  AUTH_TYPES,
  SUCCESS_CODE,
  UNAUTHORIZED,
  FORBIDDEN,
} = require('@constants');
const { verifyApiKey } = require('@auth/apiKeyAuth');
const { verifyJwt } = require('@auth/jwtAuth');
const {
  verifyIdToken,
  verifyApiKey: verifyPushieApiKey,
} = require('@auth/pushieAuth');

const checkAuthorization = auth_types => {
  return function (req, res, next) {
    if (
      !req.headers[AUTH_TYPES.API] &&
      !req.headers[AUTH_TYPES.JWT] &&
      !req.headers[AUTH_TYPES.PUSHIE_API] &&
      !req.headers[AUTH_TYPES.PUSHIE_JWT]
    ) {
      res
        .status(UNAUTHORIZED)
        .send({ userId: null, message: 'Requires authentication' });
      return;
    }
    if (auth_types.includes(AUTH_TYPES.JWT) && req.headers[AUTH_TYPES.JWT]) {
      verifyJwt(req.headers[AUTH_TYPES.JWT])
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
    } else if (
      auth_types.includes(AUTH_TYPES.API) &&
      req.headers[AUTH_TYPES.API]
    ) {
      verifyApiKey(req.headers[AUTH_TYPES.API])
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
    } else if (
      auth_types.includes(AUTH_TYPES.PUSHIE_JWT) &&
      req.headers[AUTH_TYPES.PUSHIE_JWT]
    ) {
      const token = req.headers[AUTH_TYPES.PUSHIE_JWT].split(' ')[1];
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
    } else if (
      auth_types.includes(AUTH_TYPES.PUSHIE_API) &&
      req.headers[AUTH_TYPES.PUSHIE_API]
    ) {
      verifyPushieApiKey(req.headers[AUTH_TYPES.PUSHIE_API])
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
      res.status(FORBIDDEN).send({
        userId: null,
        message:
          'Provided authentication method is not available for this route',
      });
    }
  };
};

module.exports = {
  checkAuthorization,
};
