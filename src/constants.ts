import limit from 'express-rate-limit';

const CORS_OPTIONS = {
  origin: '*',
  optionsSuccessStatus: 200,
};
const RATE_LIMITER = limit({ windowMs: 15 * 60 * 1000, max: 100 });

export { CORS_OPTIONS, RATE_LIMITER };
