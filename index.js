const { init: app } = require('./app');
const { authorization: googleAuthorization } = require('./common/auth/googleAuth');

googleAuthorization()
  .then(() => {
    app();
  })
  .catch(err => console.error(err));