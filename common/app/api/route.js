const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { encode } = require('@util/encode');
const { errorMsg } = require('@util/error');
const { getAllApiKeys, addApiKey, getApiKey } = require('@db/api');
const { SUCCESS_CODE, SERVER_ERROR } = require('@constants');


const generateApiKey = () => {
  return encode(uuidv4().replace(/-/g, ''));
};

router.post('/', (req, res) => {
  const apiKey = generateApiKey();
  addApiKey(apiKey)
    .then(() => res.status(SUCCESS_CODE).send({ data: apiKey }))
    .catch(err =>
      res
        .status(SERVER_ERROR)
        .send(errorMsg(SERVER_ERROR, 'Could not generate API key', err))
    );
});

router.get('/', (req, res) => {
  getAllApiKeys()
    .then(results => res.status(SUCCESS_CODE).send({ data: results }))
    .catch(err =>
      res
        .status(SERVER_ERROR)
        .send(errorMsg(SERVER_ERROR, 'Could not get API keys', err))
    );
});

router.get('/:id', (req, res) => {
  getApiKey(req.params.id)
    .then(results => res.status(results.statusCode).send(results.body))
    .catch(err =>
      res
        .status(SERVER_ERROR)
        .send(errorMsg(SERVER_ERROR, 'Could not get API key', err))
    );
});

module.exports = router;
