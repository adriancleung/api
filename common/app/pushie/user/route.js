const express = require('express');
const router = express.Router();
const { createUser, getUserNotifications } = require('../../../db/pushie');
const { errorMsg } = require('../../../util/error');
const {
  SUCCESS_CODE,
  SERVER_ERROR,
  RESOURCE_NOT_FOUND,
} = require('../../../constants');

router.get('/:uid', (req, res) => {
  getUserNotifications(req.params.uid)
    .then(results => res.status(SUCCESS_CODE).send(results))
    .catch(err =>
      res
        .status(SERVER_ERROR)
        .send(errorMsg(SERVER_ERROR, 'Could not retrieve notifications', err))
    );
});

router.post('/', (req, res) => {
  createUser(req.body.uid, req.body.email)
    .then(() => res.sendStatus(SUCCESS_CODE))
    .catch(err =>
      res
        .status(SERVER_ERROR)
        .send(errorMsg(SERVER_ERROR, 'Could not create user', err))
    );
});

router.get('/', (req, res) => {
  res.sendStatus(RESOURCE_NOT_FOUND);
});

module.exports = router;
