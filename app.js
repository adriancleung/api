const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const api = require('./common/app/api/route');
const mail = require('./common/app/mail/route');
const status = require('./common/app/status/route');
const { validateAuth } = require('./common/auth/apiAuth');
const { CORS_OPTIONS } = require('./common/constants');
const initializeTasks = require('./common/tasks/init');

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

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
  initializeTasks();
});

module.exports = app;
