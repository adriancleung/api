const moment = require('moment');

const getDateTimeFromTimestamp = timestamp => {
  return moment(timestamp.toDate());
};

module.exports = {
  getDateTimeFromTimestamp,
};
