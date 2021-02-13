const request = require('supertest');
const { app } = require('@root/app');

const endpoint = () => {
  request(app)
    .get('/status')
    .expect(200)
    .end((err, res) => {
      if (err) throw err;
    });
};

module.exports = {
  endpoint,
};
