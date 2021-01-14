const express = require('express');
const router = express.Router();
const { SERVER_ERROR } = require('@constants');
const { getAboutContent } = require('@db/about');
const { errorMsg } = require('@util/error');

router.get('/', (req, res) => {
  getAboutContent()
    .then(result => res.status(result.statusCode).send(result.body))
    .catch(err =>
      res
        .status(SERVER_ERROR)
        .send(errorMsg(SERVER_ERROR, 'Could not retrieve about content', err))
    );
});

module.exports = router;
