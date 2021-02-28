const express = require('express');
const router = express.Router();
const { checkAuthorization } = require('@auth');
const { AUTH_TYPES, RESOURCE_NOT_FOUND } = require('@constants');

const notify = require('@app/pushie/notify');
const token = require('@app/pushie/token');
const user = require('@app/pushie/user');

router.use('/notify', checkAuthorization([AUTH_TYPES.PUSHIE_API]), notify);
router.use('/token', checkAuthorization([AUTH_TYPES.PUSHIE_JWT]), token);
router.use('/user', checkAuthorization([AUTH_TYPES.PUSHIE_JWT]), user);

router.all('/', (req, res) => {
  res.sendStatus(RESOURCE_NOT_FOUND);
});

module.exports = router;
