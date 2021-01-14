require('module-alias/register');
const { init: app } = require('./app');
const { authorization: googleAuthorization } = require('@auth/googleAuth');

googleAuthorization()
  .then(() => {
    app();
  })
  .catch(err => console.error(err));
