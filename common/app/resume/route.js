const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const { checkAuthorization } = require('@auth');
const { getResume, updateResume } = require('@db/resume');
const { errorMsg } = require('@util/error');
const { AUTH_TYPES, SERVER_ERROR } = require('@constants');

router.post(
  '/',
  [checkAuthorization([AUTH_TYPES.JWT]), upload.any()],
  (req, res) => {
    updateResume(req.files[0].buffer.toString('base64'))
      .then(results => res.status(results.statusCode).send(results.body))
      .catch(err =>
        res
          .status(SERVER_ERROR)
          .send(errorMsg(SERVER_ERROR, 'Could not update resume', err))
      );
  }
);

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
