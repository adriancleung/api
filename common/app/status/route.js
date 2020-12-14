const os = require('os');
const express = require('express');
const { SUCCESS_CODE, SERVER_UNAVAILABLE } = require('../../constants');
const router = express.Router();

router.get('/', (req, res) => {
  const status = {
    uptime: process.uptime(),
    platform: process.platform,
    cpu: os.cpus(),
    node_version: process.versions.node,
    message: 'OK',
    timestamp: Date.now(),
  };

  try {
    res.status(SUCCESS_CODE).send(status);
  } catch (e) {
    status.message = e;
    res.status(SERVER_UNAVAILABLE).send(status);
  }
});

module.exports = router;
