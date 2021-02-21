const express = require('express');
const router = express.Router();
const { SUCCESS_CODE, SERVER_ERROR } = require('@constants');
const { storeUserDeviceToken, getUserDeviceToken } = require('@db/pushie');

router.get('/', (req, res) => {
  getUserDeviceToken(req.uid)
    .then(value => {
      res.status(SUCCESS_CODE).send({ token: value });
    })
    .catch(err =>
      res
        .status(SERVER_ERROR)
        .send(
          errorMsg(SERVER_ERROR, "Could not retrieve user's devive token", err)
        )
    );
});

router.post('/', (req, res) => {
  storeUserDeviceToken(req.uid, req.body.token)
    .then(() => res.sendStatus(SUCCESS_CODE))
    .catch(err =>
      res
        .status(SERVER_ERROR)
        .send(errorMsg(SERVER_ERROR, "Could not save user's device token", err))
    );
});

module.exports = router;
