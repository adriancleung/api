require('module-alias/register');
const { authorization: googleAuthorization } = require('@auth/googleAuth');

googleAuthorization()
  .then(() => {
    require('./cluster');
  })
  .catch(err => console.error(err));
