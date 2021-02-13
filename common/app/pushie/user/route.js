const express = require('express');
const router = express.Router();
const {
  createUser,
  getUserNotifications,
  getUserApiKey,
  deleteUserNotification,
  refreshApiKey,
} = require('@db/pushie');
const { errorMsg } = require('@util/error');
const { SUCCESS_CODE, SERVER_ERROR } = require('@constants');

router.get('/', (req, res) => {
  getUserNotifications(req.uid)
    .then(results => res.status(SUCCESS_CODE).send(results))
    .catch(err =>
      res
        .status(SERVER_ERROR)
        .send(errorMsg(SERVER_ERROR, 'Could not retrieve notifications', err))
    );
});

router.get('/api', (req, res) => {
  getUserApiKey(req.uid)
    .then(results => res.status(SUCCESS_CODE).send(results))
    .catch(err =>
      res
        .status(SERVER_ERROR)
        .send(errorMsg(SERVER_ERROR, 'Could not retrieve api key', err))
    );
});

router.post('/api', (req, res) => {
  refreshApiKey(req.uid)
    .then(results => res.status(SUCCESS_CODE).send(results))
    .catch(err =>
      res
        .status(SERVER_ERROR)
        .send(errorMsg(SERVER_ERROR, 'Could not refresh api key', err))
    );
});

router.delete('/', (req, res) => {
  deleteUserNotification(req.uid, req.body)
    .then(() => res.sendStatus(SUCCESS_CODE))
    .catch(err =>
      res
        .status(SERVER_ERROR)
        .send(
          errorMsg(SERVER_ERROR, "Could not delete user's notification", err)
        )
    );
});

router.post('/', (req, res) => {
  createUser(req.uid, req.body.email)
    .then(apiKey => res.status(SUCCESS_CODE).send(apiKey))
    .catch(err => {
      res
        .status(SERVER_ERROR)
        .send(errorMsg(SERVER_ERROR, 'Could not create user', err));
    });
});

module.exports = router;
