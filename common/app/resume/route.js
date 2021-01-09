const express = require('express');
const router = express.Router();
const { getResume } = require('../../db/resume');
const { errorMsg } = require('../../util/error');
const { SERVER_ERROR } = require('../../constants');

router.get('/', (req, res) => {
  getResume()
    .then(results => res.status(results.statusCode).send(results.body))
    .catch(err =>
      res
        .status(SERVER_ERROR)
        .send(errorMsg(SERVER_ERROR, 'Could not retrieve resume', err))
    );
});

module.exports = router;
