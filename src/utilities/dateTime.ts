import moment from 'moment';

const stringDateTimeFormat = (dateTime: string) => {
  return moment(dateTime).format('YYYY-MM-DD hh:mm:ss A');
};

export { stringDateTimeFormat };
