const { SUCCESS_CODE, SERVER_ERROR } = require('@constants');
const { encode } = require('@util/encode');

const sendMail = async (gmail, emailBody) => {
  const { firstName, lastName, email, message } = emailBody;
  from = 'From:  Contact - adrianleung.dev <contact@adrianleung.dev>\n';
  replyTo = 'Reply-To: ' + firstName + ' ' + lastName + ' <' + email + '>\n';
  to = 'To: Adrian Leung <adrian.leung@ualberta.ca>\n';
  subject = 'Subject: Contact Form Submitted!\n\n';
  body =
    firstName +
    ' ' +
    lastName +
    ' (' +
    email +
    ') sent you a message:\n\n' +
    message;
  encoded = encode(from + replyTo + to + subject + body);

  const res = await gmail.users.messages.send({
    requestBody: {
      raw: encoded,
    },
    userId: 'me',
  });

  if (res.data.labelIds.includes('SENT')) {
    console.log('Email sent!');
    return SUCCESS_CODE;
  } else {
    console.error('ERROR: Email not sent!');
    return SERVER_ERROR;
  }
};

module.exports = {
  sendMail,
};
