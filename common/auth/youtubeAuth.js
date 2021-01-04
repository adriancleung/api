const { google } = require('googleapis');
const { YOUTUBE_SCOPES } = require('../constants');
const readline = require('readline');
const { promisify } = require('util');

readline.Interface.prototype.question[promisify.custom] = function (prompt) {
  return new Promise(resolve =>
    readline.Interface.prototype.question.call(this, prompt, resolve)
  );
};
readline.Interface.prototype.questionAsync = promisify(
  readline.Interface.prototype.question
);

const authorize = async credentials => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  if (process.env.youtube_token) {
    oAuth2Client.setCredentials(JSON.parse(process.env.youtube_token));
  } else {
    const { tokens } = await getNewToken(oAuth2Client);
    oAuth2Client.credentials = tokens;
    process.env.token = JSON.stringify(tokens);
  }
  return oAuth2Client;
};

const getNewToken = async oAuth2Client => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: YOUTUBE_SCOPES,
  });

  console.log('Authorize this app by visiting this url: ', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await rl.questionAsync('Enter the code from that page here: ');
  rl.close();
  const { tokens } = await oAuth2Client.getToken(code);
  console.log(JSON.stringify(tokens));
  return { tokens };
};

module.exports = {
  authorize,
};
