const { notify } = require('@util/notify');
const { authorization } = require('@auth/googleAuth');
const { SUCCESS_CODE } = require('@constants');

const endpoint = async () => {
  if (!process.env.youtube_credentials) {
    console.error('Error loading YouTube client secret');
    return;
  }

  const { youtube } = await authorization();
  var res, value;

  try {
    res = await youtube.search.list({
      part: 'snippet',
      forMine: true,
      order: 'date',
      q: 'ECCC English Worship',
      type: 'video',
    });
  } catch (err) {
    console.error('Error retrieving latest SMW videos', err);
    notify(
      process.env.uid,
      'Error retrieving latest SMW videos',
      err.message,
      err.stack,
      'YouTube'
    );
    return;
  }

  if (res.status !== SUCCESS_CODE) {
    console.warn('Could not retrieve videos', res.data);
    notify(
      process.env.uid,
      'Could not retrieve videos',
      res.data,
      undefined,
      'YouTube'
    );
    return;
  }

  if (
    res.data.items === undefined ||
    Object.keys(res.data.items).length === 0
  ) {
    console.warn('No videos found');
    notify(
      process.env.uid,
      'No Videos Found',
      'Could not find any videos to private',
      undefined,
      'YouTube'
    );
    return;
  }

  try {
    value = await youtube.videos.update({
      part: 'status',
      resource: {
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
  } catch (err) {
    console.error('Error updating video privacy', err);
    notify(
      process.env.uid,
      'Could Not Private Video',
      `Could not make video ${res.data.items[0].id.videoId} private. Please private video manually`,
      undefined,
      'YouTube'
    );
    return;
  }

  if (
    value.status === SUCCESS_CODE &&
    value.data.status.privacyStatus === 'private'
  ) {
    console.info(`Video ${res.data.items[0].id.videoId} made private`);
    notify(
      process.env.uid,
      'Video Made Private',
      `Video ${res.data.items[0].id.videoId} was made private`,
      undefined,
      'YouTube'
    );
  } else {
    console.warn('Could not update video privacy', value.data);
    notify(
      process.env.uid,
      'Could Not Private Video',
      `Could not make video ${res.data.items[0].id.videoId} private. Please private video manually`,
      undefined,
      'YouTube'
    );
  }
};

module.exports = {
  endpoint,
};
