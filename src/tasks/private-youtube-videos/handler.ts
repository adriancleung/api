import { createAndSendUserNotification } from '../../handlers/notification.handlers';
import { youtube } from '../../services/google.services';
import { ApiResponseCode } from '../../types/response';

const schedule = '*/5 * * * *';
const endpoint = async () => {
  if (!process.env.YOUTUBE_CREDENTIALS) {
    console.error('Error loading YouTube client secret');
    return;
  }

  const yt = await youtube();

  try {
    const res = await yt.search.list({
      part: ['snippet'],
      forMine: true,
      order: 'date',
      q: 'ECCC English Worship',
      type: ['video'],
    });

    if (res.status !== ApiResponseCode.SUCCESS) {
      console.warn('Could not retrieve videos', res.data);
      createAndSendUserNotification(
        process.env.UID,
        'Could not retrieve videos',
        JSON.stringify(res.data)
      );
      return;
    }

    if (
      res.data.items === undefined ||
      Object.keys(res.data.items).length === 0
    ) {
      console.warn('No videos found');
      createAndSendUserNotification(
        process.env.UID,
        'No videos found',
        'Could not find any videos to private'
      );
      return;
    }

    try {
      const value = await yt.videos.update({
        part: ['status'],
        requestBody: {
          id: res.data.items[0].id.videoId,
          status: {
            uploadStatus: 'processed',
            privacyStatus: 'private',
            license: 'youtube',
            embeddable: true,
            publicStatsViewable: true,
            madeForKids: false,
            selfDeclaredMadeForKids: false,
          },
        },
      });

      if (
        value.status === ApiResponseCode.SUCCESS &&
        value.data.status.privacyStatus === 'private'
      ) {
        console.info(`Video ${res.data.items[0].id.videoId} made private`);
        createAndSendUserNotification(
          process.env.UID,
          'Video made private',
          `Video ${res.data.items[0].id.videoId} was made private`
        );
        return;
      }
      console.warn('Could not update video privacy', value.data);
      createAndSendUserNotification(
        process.env.UID,
        'Could not private video',
        `Could not make video ${res.data.items[0].id.videoId} private. Please private video manually`
      );
      return;
    } catch (err) {
      console.error('Error updating video privacy', err);
      createAndSendUserNotification(
        process.env.UID,
        'Could not private video',
        err.message,
        err.stack
      );
      return;
    }
  } catch (err) {
    console.error('Error retrieving latest SMW videos', err);
    createAndSendUserNotification(
      process.env.UID,
      'Error retrieving latest SMW videos',
      err.message,
      err.stack
    );
  }
};

export default [endpoint, schedule];
