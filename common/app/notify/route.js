const express = require('express');
const { saveDeviceToken, getNotifications } = require('../../db/notifications');
const router = express.Router();
const { notify } = require('./util');

router.get('/', async (req, res) => {
  getNotifications().then(results => res.send(results));
});

router.post('/', async (req, res) => {
  notify(req.body.title, req.body.shortDescription, req.body.description)
    .then(() => res.sendStatus(200))
    .catch(err => console.error(err));
});

router.post('/token', async (req, res) => {
  saveDeviceToken(req.body.token)
    .then(() => res.sendStatus(200))
    .catch(err => console.error(err));
});

module.exports = router;
