const encode = unencoded => {
  var encoded = new Buffer.from(unencoded).toString('base64');
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

module.exports = {
  encode,
};
