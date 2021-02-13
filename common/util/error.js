const errorMsg = (code, message, e) => {
  if (e) {
    return { error: { code: code, message: message, errorMsg: e.message } };
  }
  return { error: { code: code, message: message } };
};

module.exports = {
  errorMsg,
};
