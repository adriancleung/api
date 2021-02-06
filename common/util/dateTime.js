const moment = require('moment');

const getDateTimeFromTimestamp = timestamp => {
  return moment(timestamp.toDate());
};

const stringDateTimeFormat = dateTime => {
  return moment(dateTime).format('YYYY-MM-DD hh:mm:ss A');
}

module.exports = {
  getDateTimeFromTimestamp,
  stringDateTimeFormat,
};
