const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

const storeData = async (key, value) => {
  try {
    const res = await redis.set(key, value);
    return res;
  } catch (err) {
    throw new Error(err);
  }
};

const getData = async (key) => {
  try {
    const res = await redis.get(key);
    return res;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  storeData,
  getData,
};
