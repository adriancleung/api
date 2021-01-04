const express = require('express');
const router = express.Router();
const { checkAuthorization } = require('../../auth');
const { authorization } = require('../../auth/googleAuth');
const { SUCCESS_CODE, SERVER_ERROR } = require('../../constants');
const { sendMail } = require('./util');
const { saveMail, getAllMail } = require('../../db/mail');

router.post('/', async (req, res) => {
  const emailBody = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    message: req.body.message,
  };

  if (!process.env.credentials) {
    res.status(SERVER_ERROR).send('Error loading client secret');
  } else {
    const { gmail } = await authorization();
    sendMail(gmail, emailBody).then(statusCode => {
      if (statusCode === SUCCESS_CODE) {
        saveMail(emailBody)
          .then(value => {
            res.sendStatus(value);
          })
          .catch(() => res.sendStatus(SERVER_ERROR));
      } else {
        res.sendStatus(SERVER_ERROR);
      }
    });
  }
});

router.get('/', checkAuthorization, (req, res) => {
  getAllMail()
    .then(results => res.status(SUCCESS_CODE).send({ mail: results }))
    .catch(() => res.sendStatus(SERVER_ERROR));
});

module.exports = router;
