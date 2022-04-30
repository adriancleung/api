import axios from 'axios';
import { stringDateTimeFormat } from '../../utilities/dateTime';
import { getData, storeData } from '../../utilities/redis';

enum EclassStatus {
  NONE = 'Operational',
  MINOR = 'Minor Issues',
  MAJOR = 'Major Issues',
  CRITICAL = 'Critical Issues',
  MAINTENANCE = 'Under Maintenance',
}

enum EclassColours {
  NONE = 3066993,
  MINOR = 15844367,
  MAJOR = 15105570,
  CRITICAL = 15158332,
  MAINTENANCE = 3447003,
}

const schedule = '*/5 * * * *';
const endpoint = async () => {
  if (!process.env.DISCORD_ECLASS_WEBHOOK) {
    console.error('Error loading Discord webhook URL');
  } else {
    const previousStatus = await getData('previousEClassStatus');

    if (previousStatus === null) {
      storeData('previousEClassStatus', 'none');
      return;
    }

    const res = await axios.get(
      'https://status.eclass.ualberta.ca/api/v2/status.json'
    );
    const status: string = res.data.status.indicator;

    if (previousStatus !== status) {
      const description: string = res.data.status.description;
      const url: string = res.data.page.url;
      const updateTime = stringDateTimeFormat(res.data.page.updated_at);
      axios.post(
        process.env.DISCORD_ECLASS_WEBHOOK,
        {
          embeds: [
            {
              title: `eClass Status: ${EclassStatus[status.toUpperCase()]}`,
              color: EclassColours[status.toUpperCase()],
              type: 'rich',
              description: description,
              url: url,
              foorter: {
                text: `Updated at: ${updateTime}`,
              },
            },
          ],
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      storeData('previousEClassStatus', status);
    }
  }
};

export default [endpoint, schedule];
