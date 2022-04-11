import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

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
