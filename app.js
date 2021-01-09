// Imports Packages
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const favicon = require('serve-favicon');
const compression = require('compression');

// Routes
const about = require('./common/app/about/route');
const api = require('./common/app/api/route');
const auth = require('./common/app/auth/route');
const brewCoffee = require('./common/app/brew-coffee/route');
const mail = require('./common/app/mail/route');
const resume = require('./common/app/resume/route');
const status = require('./common/app/status/route');


// Import Modules
const { checkAuthorization } = require('./common/auth');
const { CORS_OPTIONS, RATE_LIMITER } = require('./common/constants');
const { init: initializeTasks } = require('./common/tasks/init');
const { apiLogging } = require('./common/util/logging');
require('./common/util/logging').consoleLogging;

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
  app.use('/resume', resume);
  app.use('/status', status);

  app.get('/', (req, res) => {
    res.redirect(301, 'https://adrianleung.dev');
  });

  const listener = app.listen(process.env.PORT, () => {
    console.info('Your app is listening on port ' + listener.address().port);
    initializeTasks();
  });
}



module.exports = {
  init,
  app,
};
