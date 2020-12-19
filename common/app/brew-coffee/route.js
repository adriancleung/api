const express = require('express');
const router = express.Router();

router.all('/', (req, res) => {
  res.status(418).send('I\'m a teapot');
});

module.exports = router;