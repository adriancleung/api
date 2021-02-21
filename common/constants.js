const rateLimit = require('express-rate-limit');
const path = require('path');
const {
  name: appName,
  version,
  description,
  author,
} = require('../package.json');

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

const ECLASS_STATUS_TEXT = {
  none: 'Operational',
  minor: 'Minor Issues',
  major: 'Major Issues',
  critical: 'Critical Issues',
};

const ECLASS_EMBED_COLOURS = {
  none: 3066993,
  minor: 15844367,
  major: 15105570,
  critical: 15158332,
};

const OPENAPI_OPTIONS = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: appName,
      description,
      version,
      contact: {
        name: author.name,
        url: author.url,
        email: author.email,
      },
      license: {
        name: 'MIT License',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'https://api.adrianleung.dev',
      },
    ],
    tags: [
      {
        name: 'pushie',
        description: 'Endpoints for pushie app',
      },
      {
        name: 'website',
        description: 'Endpoints for [adrianleung.dev](https://adrianleung.dev)',
      },
    ],
  },
  apis: ['./common/app/**/*.js', './docs/openapi.yaml'],
};

const SWAGGER_UI_OPTIONS = {
  customSiteTitle: appName,
  customCss: '.swagger-ui .topbar { display: none }',
};

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
  ECLASS_STATUS_TEXT,
  ECLASS_EMBED_COLOURS,
  OPENAPI_OPTIONS,
  SWAGGER_UI_OPTIONS,
};
