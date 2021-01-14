const express = require('express');
const router = express.Router();
const {
  SUCCESS_CODE,
  RESOURCE_NOT_FOUND,
  FORBIDDEN,
  SERVER_ERROR,
} = require('@constants');
const { signup, login, verifyJwt } = require('@auth/jwtAuth');
const { errorMsg } = require('@util/error');

router.all('/', (req, res) => {
  return res.sendStatus(RESOURCE_NOT_FOUND);
});

router.post('/signup', (req, res) => {
  signup(req.body.userName, req.body.password)
    .then(() => res.sendStatus(SUCCESS_CODE))
    .catch(err => {
      res
        .status(SERVER_ERROR)
        .send(errorMsg(SERVER_ERROR, 'Could not sign up user', err));
    });
});

router.post('/login', (req, res) => {
  login(req.body.email, req.body.password)
    .then(value => {
      res.status(value.statusCode).send(value.body);
    })
    .catch(err => {
      res
        .status(SERVER_ERROR)
        .send(errorMsg(SERVER_ERROR, 'Could not login user', err));
    });
});

router.post('/verify', (req, res) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    res.status(FORBIDDEN).send({ message: 'No token provided' });
  }
  verifyJwt(token)
    .then(value => res.status(value.statusCode).send(value.body))
    .catch(err => {
      res
        .status(SERVER_ERROR)
        .send(errorMsg(SERVER_ERROR, 'Could not verify user', err));
    });
});

module.exports = router;
