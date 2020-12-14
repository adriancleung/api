const path = require('path');
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const CORS_OPTIONS = {
  origin: '*',
  optionsSuccessStatus: 200,
};
const SUCCESS_CODE = 200;
const CLIENT_ERROR = 400;
const UNAUTHORIZED = 401;
const RESOURCE_NOT_FOUND = 404;
const SERVER_ERROR = 500;
const SERVER_UNAVAILABLE = 503;

const ROOT_DIR = path.dirname(require.main.filename || process.mainModule.filename);

module.exports = {
  SCOPES,
  CORS_OPTIONS,
  ROOT_DIR,
  SUCCESS_CODE,
  CLIENT_ERROR,
  UNAUTHORIZED,
  RESOURCE_NOT_FOUND,
  SERVER_ERROR,
  SERVER_UNAVAILABLE,
};
