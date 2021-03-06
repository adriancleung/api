const express = require('express');
const router = express.Router();
const { checkAuthorization } = require('@auth');
const { authorization } = require('@auth/googleAuth');
const { AUTH_TYPES, SUCCESS_CODE, SERVER_ERROR } = require('@constants');
const { sendMail } = require('@app/mail/util');
const { saveMail, getAllMail } = require('@db/mail');
const { errorMsg } = require('@util/error');

router.get(
  '/',
  checkAuthorization([AUTH_TYPES.API, AUTH_TYPES.JWT]),
  (req, res) => {
    getAllMail()
      .then(results => res.status(SUCCESS_CODE).send({ mail: results }))
      .catch(err =>
        res
          .status(SERVER_ERROR)
          .send(errorMsg(SERVER_ERROR, 'Cannot retrieve mail', err))
      );
  }
);

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
    sendMail(gmail, emailBody)
      .then(statusCode => {
        if (statusCode === SUCCESS_CODE) {
          saveMail(emailBody)
            .then(value => {
              notify(
                process.env.uid,
                "You've Got Mail!",
                'Check your mailbox for your message'
              );
              res.status(value);
            })
            .catch(err =>
              res
                .status(SERVER_ERROR)
                .send(
                  errorMsg(SERVER_ERROR, 'Could not save mail to database', err)
                )
            );
        } else {
          res
            .status(SERVER_ERROR)
            .send(errorMsg(SERVER_ERROR, 'Could not send mail'));
        }
      })
      .catch(err =>
        res
          .status(SERVER_ERROR)
          .send(errorMsg(SERVER_ERROR, 'Could not send mail', err))
      );
  }
});

module.exports = router;
