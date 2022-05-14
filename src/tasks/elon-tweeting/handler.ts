import axios from 'axios';
import { createAndSendUserNotification } from '../../handlers/notification.handlers';
import { getData, storeData } from '../../utilities/redis';

const schedule = '*/5 * * * *';
const endpoint = async () => {
  const KEYWORDS = ['doge', 'dogecoin', 'moon', 'shiba', 'shiba inu'];

  if (!process.env.TWITTER_API_BEARER) {
    console.error('Error loading Twitter bearer token');
    return;
  }

  const previousTweetId = await getData('previousTweetId');

  if (previousTweetId === null) {
    storeData('previousTweetId', 'none');
    return;
  }

  try {
    const res = await axios.get(
      'https://api.twitter.com/2/users/44196397/tweets?exclude=replies&max_results=5',
      { headers: { Authorization: `Bearer ${process.env.TWITTER_API_BEARER}` } }
    );

    if (res.data.data === undefined) {
      console.warn(
        `Query did not return any data\nResponse Code: ${
          res.status
        }\nData: ${JSON.stringify(res.data)}`
      );
      return;
    }

    const tweetId = res.data.data[0].id;
    const tweet = res.data.data[0].text;

    if (previousTweetId !== tweetId) {
      if (KEYWORDS.some(keyword => tweet.toLowerCase().includes(keyword))) {
        createAndSendUserNotification(
          process.env.UID,
          'Elon tweeted about Dogecoin! 🐶',
          tweet
        );
      }
      storeData('previousTweetId', tweetId);
    }
  } catch (err) {
    console.error('Could not retrieve tweets', err);
    createAndSendUserNotification(
      process.env.UID,
      'Could not retrieve tweets',
      err.message,
      err.stack
    );
  }
};

export default [endpoint, schedule];
