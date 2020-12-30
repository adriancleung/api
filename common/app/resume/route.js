const express = require('express');
const router = express.Router();
const { getResume } = require('../../db/resume');
const { SERVER_ERROR } = require('../../constants');

router.get('/', (req, res) => {
  getResume()
    .then(results => res.status(results.statusCode).send(results.body))
    .catch(() => res.sendStatus(SERVER_ERROR));
});

module.exports = router;
