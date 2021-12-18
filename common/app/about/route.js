const express = require('express');
const router = express.Router();

const { checkAuthorization } = require('@auth');
const { AUTH_TYPES, SERVER_ERROR } = require('@constants');
const { getAboutContent, updateAboutContent } = require('@db/about');
const { errorMsg } = require('@util/error');

router.post('/', checkAuthorization([AUTH_TYPES.JWT]), (req, res) => {
  updateAboutContent(req.body.content)
    .then(results => res.status(results.statusCode).send(results.body))
    .catch(err =>
      res
        .status(SERVER_ERROR)
        .send(errorMsg(SERVER_ERROR, 'Could not update about content', err))
    );
});

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
