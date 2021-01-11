const express = require('express');
const router = express.Router();
const {
  SUCCESS_CODE,
  SERVER_ERROR,
  RESOURCE_NOT_FOUND,
} = require('../../../constants');
const { storeUserDeviceToken } = require('../../../db/users');

router.post('/:uid', (req, res) => {
  storeUserDeviceToken(req.params.uid, req.body.token)
    .then(() => res.sendStatus(SUCCESS_CODE))
    .catch(err =>
      res
        .status(SERVER_ERROR)
        .send(errorMsg(SERVER_ERROR, "Could not save user's device token", err))
    );
});

router.all('/', (req, res) => {
  res.sendStatus(RESOURCE_NOT_FOUND);
});

module.exports = router;
