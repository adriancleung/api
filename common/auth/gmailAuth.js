const { google } = require('googleapis');
const { SCOPES } = require('../constants');
const readline = require('readline');

const authorize = async (credentials, callback, emailBody) => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  if (process.env.token) {
    oAuth2Client.setCredentials(JSON.parse(process.env.token));
    return await callback(oAuth2Client, emailBody);
  } else {
    return await getNewToken(oAuth2Client, callback, emailBody);
  }
};

const getNewToken = (oAuth2Client, callback, emailBody) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', code => {
    rl.close();
    oAuth2Client.getToken(code, async (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      process.env.token = JSON.stringify(token);
      return await callback(oAuth2Client, emailBody);
    });
  });
};

module.exports = {
  authorize,
};
