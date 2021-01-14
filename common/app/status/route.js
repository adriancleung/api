const os = require('os');
const express = require('express');
const {
  appName,
  version,
  SUCCESS_CODE,
  SERVER_UNAVAILABLE,
} = require('@constants');
const { errorMsg } = require('@util/error');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    const status = {
      appName: appName,
      version: version,
      uptime: process.uptime(),
      platform: process.platform,
      cpu: os.cpus(),
      node_version: process.versions.node,
      message: 'OK',
      timestamp: Date.now(),
    };

    res.status(SUCCESS_CODE).send({ status: status });
  } catch (e) {
    res
      .status(SERVER_UNAVAILABLE)
      .send(errorMsg(SERVER_UNAVAILABLE, 'Could not retrieve API status', e));
  }
});

module.exports = router;
