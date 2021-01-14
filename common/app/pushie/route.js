const express = require('express');
const router = express.Router();
const { RESOURCE_NOT_FOUND } = require('@constants');

const notify = require('@app/pushie/notify');
const token = require('@app/pushie/token');
const user = require('@app/pushie/user');

router.use('/notify', notify);
router.use('/token', token);
router.use('/user', user);

router.all('/', (req, res) => {
  res.sendStatus(RESOURCE_NOT_FOUND);
});

module.exports = router;
