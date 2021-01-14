const moment = require('moment');

const getDateTimeFromTimestamp = timestamp => {
  return moment(timestamp.toDate()).format('yyyy-MM-DD hh:mm A');
};

module.exports = {
  getDateTimeFromTimestamp,
};
