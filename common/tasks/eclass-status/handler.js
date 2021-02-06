const axios = require('axios').default;
const { ECLASS_STATUS_TEXT, ECLASS_EMBED_COLOURS } = require('@constants');
const { stringDateTimeFormat } = require('@util/dateTime');
const { getData, storeData } = require('@util/redis');

const endpoint = async () => {
  if (!process.env.discord_eclass_webhook) {
    console.error('Error loading Discord webhook URL');
  } else {
    const previousStatus = await getData('previousEClassStatus');
    
    if (previousStatus !== null) {
      await storeData('previousEClassStatus', status);
      return;
    }

    const res = await axios.get(
      'https://status.eclass.ualberta.ca/api/v2/status.json'
    );
    const status = res.data.status.indicator;
    if (previousStatus !== status) {
      const description = res.data.status.description;
      const url = res.data.page.url;
      const update_time = stringDateTimeFormat(res.data.page.updated_at);
      await axios.post(
        process.env.discord_eclass_webhook,
        {
          embeds: [
            {
              title: `eClass Status: ${ECLASS_STATUS_TEXT[status]}`,
              color: ECLASS_EMBED_COLOURS[status],
              type: 'rich',
              description: description,
              url: url,
              footer: {
                text: `Updated at: ${update_time}`,
              },
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      await storeData('previousEClassStatus', status);
    }
  }
};

module.exports = {
  endpoint,
};
