const express = require('express');
const router = express.Router();
const { RESOURCE_NOT_FOUND } = require('../../constants');

const token = require('./token/route');
const user = require('./user/route');

router.use('/token', token);
router.use('/user', user);

router.all('/', (req, res) => {
  res.sendStatus(RESOURCE_NOT_FOUND);
});

module.exports = router;
