const { notify } = require('@util/notify');
const { authorization } = require('@auth/googleAuth');
const { SUCCESS_CODE } = require('@constants');

const endpoint = async () => {
  if (!process.env.youtube_credentials) {
    console.error('Error loading YouTube client secret');
  } else {
    const { youtube } = await authorization();

    youtube.search
      .list({
        part: 'snippet',
        forMine: true,
        order: 'date',
        q: 'SMW',
        type: 'video',
      })
      .then(response => {
        if (response.status !== SUCCESS_CODE) {
          console.warn('Could not retrieve videos', response.data);
          return;
        }

        if (
          response.data.items === undefined ||
          Object.keys(response.data.items).length == 0
        ) {
          console.warn('No videos found');
          notify(
            process.env.uid,
            'No Videos Found',
            'Could not find any videos to private',
            null
          );
          return;
        }

        youtube.videos
          .update({
            part: 'status',
            resource: {
              id: response.data.items[0].id.videoId,
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
          })
          .then(value => {
            if (value.status === SUCCESS_CODE) {
              console.info(
                `Video ${response.data.items[0].id.videoId} made private`
              );
              notify(
                process.env.uid,
                'Video Made Private',
                `Video ${response.data.items[0].id.videoId} was made private`,
                null
              );
            } else {
              console.warn('Could not update video privacy', value.data);
              notify(
                process.env.uid,
                'Could Not Private Video',
                `Could not make video ${response.data.items[0].id.videoId} private. Please private video manually`,
                null
              );
            }
          })
          .catch(err => console.error('Error updating video privacy', err));
      })
      .catch(err => console.error('Error retrieving latest SMW videos', err));
  }
};

module.exports = {
  endpoint,
};
