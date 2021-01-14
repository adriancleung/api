const express = require('express');
const router = express.Router();
const { notify } = require('@util/notify');
const { errorMsg } = require('@util/error');
const { SUCCESS_CODE, SERVER_ERROR } = require('@constants');

router.post('/', async (req, res) => {
  notify(
    req.body.uid,
    req.body.title,
    req.body.shortDescription,
    req.body.description
  )
    .then(() => res.sendStatus(SUCCESS_CODE))
    .catch(err =>
      res
        .status(SERVER_ERROR)
        .send(errorMsg(SERVER_ERROR, 'Could not send push notification', err))
    );
});

module.exports = router;
