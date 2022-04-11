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
      q: 'SMW',
      type: ['video'],
    });

    if (res.status !== ApiResponseCode.SUCCESS) {
      console.warn('Could not retrieve videos', res.data);
      return;
    }

    if (
      res.data.items === undefined ||
      Object.keys(res.data.items).length === 0
    ) {
      console.warn('No videos found');
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
        return;
      }
      console.warn('Could not update video privacy', value.data);
      return;
    } catch (err) {
      console.error('Error updating video privacy', err);
      return;
    }
  } catch (err) {
    console.error('Error retrieving latest SMW videos', err);
  }
};

export default [endpoint, schedule];
