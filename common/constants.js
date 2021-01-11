const rateLimit = require('express-rate-limit');
const path = require('path');
const { name: appName, version } = require('../package.json');

const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const YOUTUBE_SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl'];

const CORS_OPTIONS = {
  origin: '*',
  optionsSuccessStatus: 200,
};
const RATE_LIMITER = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const SUCCESS_CODE = 200;
const CLIENT_ERROR = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const RESOURCE_NOT_FOUND = 404;
const SERVER_ERROR = 500;
const SERVER_UNAVAILABLE = 503;

const ROOT_DIR = path.dirname(
  require.main.filename || process.mainModule.filename
);
const TASKS_PATH = ROOT_DIR + '/tasks.yaml';

module.exports = {
  appName,
  version,
  GMAIL_SCOPES,
  YOUTUBE_SCOPES,
  CORS_OPTIONS,
  RATE_LIMITER,
  ROOT_DIR,
  TASKS_PATH,
  SUCCESS_CODE,
  CLIENT_ERROR,
  UNAUTHORIZED,
  FORBIDDEN,
  RESOURCE_NOT_FOUND,
  SERVER_ERROR,
  SERVER_UNAVAILABLE,
};