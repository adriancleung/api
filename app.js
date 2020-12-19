// Imports Packages
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// Routes
const api = require('./common/app/api/route');
const mail = require('./common/app/mail/route');
const status = require('./common/app/status/route');
const brewCoffee = require('./common/app/brew-coffee/route');

// Import Modules
const { validateAuth } = require('./common/auth/apiAuth');
const { CORS_OPTIONS } = require('./common/constants');
const initializeTasks = require('./common/tasks/init');
const { apiLogging } = require('./common/util/logging');
require('./common/util/logging').consoleLogging;

const app = express();

// Middleware
app.use(helmet());
app.use(cors(CORS_OPTIONS));
app.use(apiLogging);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.redirect(301, 'https://adrianleung.dev');
});

app.use('/mail', mail);
app.use('/api', validateAuth, api);
app.use('/status', status);
app.use('/brew-coffee', brewCoffee);

const listener = app.listen(process.env.PORT, () => {
  console.info('Your app is listening on port ' + listener.address().port);
  initializeTasks();
});

module.exports = app;
