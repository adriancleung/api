const encode = (unencoded: string) => {
  var encoded = Buffer.from(unencoded).toString('base64');
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

export { encode };
