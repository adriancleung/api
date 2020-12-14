const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const https = require('https');
const app = express();
const api = require('./common/app/api/route');
const mail = require('./common/app/mail/route');
const status = require('./common/app/status/route');
const { validateAuth } = require('./common/auth/apiAuth');
const { CORS_OPTIONS, ROOT_DIR } = require('./common/constants');

app.use(helmet());
app.use(cors(CORS_OPTIONS));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect(301, 'https://adrianleung.dev');
});

app.use('/mail', mail);
app.use('/api', validateAuth, api);
app.use('/status', status);

const listener = https
  .createServer(
    {
      key: process.env.server_key,
      cert: process.env.server_cert,
    },
    app
  )
  .listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port);
  });
