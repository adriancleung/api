const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { encode } = require('../../util/encode');
const { getAllApiKeys, addApiKey, getApiKey } = require('../../db/api');
const { SUCCESS_CODE, SERVER_ERROR } = require('../../constants');

const generateApiKey = () => {
  return encode(uuidv4().replace(/-/g, ''));
};

router.post('/', (req, res) => {
  const apiKey = generateApiKey();
  addApiKey(apiKey)
    .then(() => res.status(SUCCESS_CODE).json({ apiKey: apiKey }))
    .catch(() => res.sendStatus(SERVER_ERROR));
});

router.get('/', (req, res) => {
  getAllApiKeys()
    .then(results => res.status(SUCCESS_CODE).json({ apiKeys: results }))
    .catch(() => res.sendStatus(SERVER_ERROR));
});

router.get('/:id', (req, res) => {
  getApiKey(req.params.id)
    .then(results => res.status(results.statusCode).json(results.body))
    .catch(() => res.sendStatus(SERVER_ERROR));
});

module.exports = router;
