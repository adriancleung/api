const axios = require('axios').default;
const { getData, storeData } = require('@util/redis');
const { notify } = require('@util/notify');
const { TWEET_KEYWORDS } = require('@constants');

const endpoint = async () => {
  if (!process.env.TWITTER_API_BEARER) {
    console.error('Error loading Twitter bearer token');
    return;
  }

  const previousTweetId = await getData('previousTweetId');

  if (previousTweetId === null) {
    await storeData('previousTweetId', 'none');
    return;
  }

  const res = await axios.get(
    'https://api.twitter.com/2/users/44196397/tweets?exclude=replies&max_results=5',
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_API_BEARER}`,
      },
    }
  );

  const tweetId = res.data[0].id;
  const tweet = res.data[0].id;
  if (previousTweetId !== tweetId) {
    if (TWEET_KEYWORDS.some(keyword => tweet.toLowerCase().includes(keyword))) {
      await notify(process.env.uid, 'Elon tweeted about Dogecoin! 🐶', tweet);
    }
    await storeData('previousTweetId', tweetId);
  }
};

module.exports = {
  endpoint,
};
