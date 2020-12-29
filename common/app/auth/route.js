const express = require('express');
const router = express.Router();
const { RESOURCE_NOT_FOUND, FORBIDDEN } = require('../../constants');
const { signup, login, verify } = require('../../auth/jwtAuth');

router.all('/', (req, res) => {
  return res.sendStatus(RESOURCE_NOT_FOUND);
});

router.post('/signup', (req, res) => {
  signup(req.body.userName, req.body.password).then(() => res.sendStatus(200));
});

router.post('/login', (req, res) => {
  login(req.body.email, req.body.password).then(value => {
    res.status(value.statusCode).json(value.body);
  });
});

router.post('/verify', (req, res) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    res.status(FORBIDDEN).send({ message: 'No token provided' });
  }
  const result = verify(token);
  res.status(result.statusCode).json(result.body);
});

module.exports = router;
