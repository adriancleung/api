import Redis from 'ioredis';

const env = process.env.NODE_ENV || 'development';

let redis: Redis.Redis;

if (env === 'production') {
  if (!process.env.REDIS_URL) {
    throw new Error('Production Redis url is not set');
  }
  redis = new Redis(process.env.REDIS_URL);
} else {
  if (!process.env.REDIST_PORT && !process.env.REDIS_HOST) {
    throw new Error('Development redis environment variables are not set');
  }
  const port = parseInt(process.env.REDIS_PORT) || 6379;
  redis = new Redis(port, process.env.REDIS_HOST);
}

const getData = async (key: string) => {
  try {
    const res = await redis.get(key);
    return res;
  } catch (err) {
    throw new Error(err);
  }
};

const storeData = async (key: string, value: string) => {
  try {
    const res = await redis.set(key, value);
    return res;
  } catch (err) {
    throw new Error(err);
  }
};

export { getData, storeData };
