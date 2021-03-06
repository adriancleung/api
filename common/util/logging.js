const morgan = require('morgan');
const moment = require('moment');
const chalk = require('chalk');

morgan.token('status', (req, res) => {
  const status = (
    typeof res.headersSent !== `boolean`
      ? Boolean(res._header)
      : res.headersSent
  )
    ? res.statusCode
    : undefined;

  const color =
    status >= 500
      ? 31
      : status >= 400
      ? 33
      : status >= 300
      ? 36
      : status >= 200
      ? 32
      : 0;
  return `\x1b[${color}m${status}\x1b[0m`;
});

morgan.token('date', (req, res) => {
  return chalk`{grey [${moment().format('ddd MMM DD YYYY HH:mm:ssZZ')}]}`;
});

morgan.token('log_level', (req, res) => {
  const status = (
    typeof res.headersSent !== 'boolean'
      ? Boolean(res._header)
      : res.headersSent
  )
    ? res.statusCode
    : undefined;

  const color =
    status >= 500
      ? chalk`{red [API]  }`
      : status >= 400
      ? chalk`{yellow [API]  }`
      : status >= 300
      ? chalk`{cyan [API]  }`
      : status >= 200
      ? chalk`{green [API]  }`
      : 0;
  return color;
});

const apiLogging = morgan(
  ':date :log_level :method :url :status :response-time ms - :res[content-length]'
);

const CONSOLE_LOGGING = {
  format: ':date(ddd mmm dd yyyy HH:MM:sso).grey :log_level(7).grey',
  tokens: {
    log_level: arg => {
      const { method, defaultTokens } = arg;
      var label = defaultTokens.label(arg);
      if (method === 'error') {
        label = chalk`{red ${label}}`;
      } else if (method === 'warn') {
        label = chalk`{yellow ${label}}`;
      }
      return label;
    },
  },
};

const consoleLogging = require('console-stamp')(console, CONSOLE_LOGGING);

module.exports = {
  consoleLogging,
  apiLogging,
};
