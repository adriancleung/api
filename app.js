// Imports Packages
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const favicon = require('serve-favicon');
const compression = require('compression');

// Routes
const about = require('@app/about');
const api = require('@app/api');
const auth = require('@app/auth');
const brewCoffee = require('@app/brew-coffee');
const mail = require('@app/mail');
const pushie = require('@app/pushie/route');
const resume = require('@app/resume/route');
const status = require('@app/status/route');



// Import Modules
const { checkAuthorization } = require('@auth');
const { CORS_OPTIONS, RATE_LIMITER } = require('@constants');
const { init: initializeTasks } = require('@tasks/init');
const { apiLogging } = require('@util/logging');
require('@util/logging').consoleLogging;

const app = express();

const init = () => {
  // Middleware
  app.use(compression());
  app.use(helmet());
  app.use(cors(CORS_OPTIONS));
  app.use(RATE_LIMITER);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(favicon('favicon.ico'));
  app.use(apiLogging);

  app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'Mostly coffee');
    next();
  });

  // Routes
  app.use('/about', about);
  app.use('/api', checkAuthorization, api);
  app.use('/auth', auth);
  app.use('/brew-coffee', brewCoffee);
  app.use('/mail', mail);
  app.use('/pushie', checkAuthorization, pushie);
  app.use('/resume', resume);
  app.use('/status', status);

  app.get('/', (req, res) => {
    res.redirect(301, 'https://adrianleung.dev');
  });

  const listener = app.listen(process.env.PORT, () => {
    console.info('Your app is listening on port ' + listener.address().port);
    initializeTasks();
  });
};

module.exports = {
  init,
  app,
};
