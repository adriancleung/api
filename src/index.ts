import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import favicon from 'serve-favicon';
import compression from 'compression';

import db from './db';
db.sync({ alter: true });

// import Tasks from './tasks';
// Tasks.init();

import { CORS_OPTIONS, RATE_LIMITER } from './constants';

import { logging } from './middlewares/logging.middlewares';

import about from './routes/about.routes';
import auth from './routes/auth.routes';
import mails from './routes/mail.routes';
import notify from './routes/notify.routes';
import resume from './routes/resume.routes';
import users from './routes/user.routes';

const app = express();

app.use(helmet());
app.use(RATE_LIMITER);
app.use(compression());
app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon('favicon.ico'));
app.use(logging);

app.use((_req, res, next) => {
  res.setHeader('X-Powered-By', 'Mostly coffee');
  next();
});

app.use('/about', about);
app.use(auth);
app.use('/mails', mails);
app.use(notify);
app.use('/users', users);
app.use('/resume', resume);

app.get('/', (_req, res) => {
  res.redirect(301, 'https://adrianleung.dev');
});

app.get('/pushie', (_req, res) => {
  res.redirect(301, 'https://adrianleung.dev/pushie');
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.info('Your app is listening on port ' + port);
});
