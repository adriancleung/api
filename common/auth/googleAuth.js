const { google } = require('googleapis');
const readline = require('readline');
const { promisify } = require('util');
const { GMAIL_SCOPES, YOUTUBE_SCOPES } = require('@constants');

readline.Interface.prototype.question[promisify.custom] = function (prompt) {
  return new Promise(resolve =>
    readline.Interface.prototype.question.call(this, prompt, resolve)
  );
};
readline.Interface.prototype.questionAsync = promisify(
  readline.Interface.prototype.question
);

const authorize = async (api, scope) => {
  const envTokenString = `${api}_token`;
  const credentials = JSON.parse(process.env[`${api}_credentials`]);
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  if (process.env[envTokenString]) {
    oAuth2Client.setCredentials(JSON.parse(process.env[envTokenString]));
  } else {
    const token = await getNewToken(oAuth2Client, scope, envTokenString);
    oAuth2Client.credentials = token;
    process.env[envTokenString] = JSON.stringify(token);
  }

  return oAuth2Client;
};

const getNewToken = async (oAuth2Client, scope, envTokenString) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scope,
  });

  console.log('Authorize this app by visiting this url: ', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await rl.questionAsync('Enter the code from that page here: ');
  rl.close();
  const { tokens } = await oAuth2Client.getToken(code);
  console.info(
    `Set environment variable ${envTokenString} to the following: `,
    JSON.stringify(tokens)
  );
  return tokens;
};

const authorization = async () => {
  if (!process.env.gmail_credentials || !process.env.youtube_credentials) {
    throw new Error('Error loading Gmail or YouTube client secrets');
  }

  try {
    const gmailAuth = await authorize('gmail', GMAIL_SCOPES);
    const gmail = google.gmail({ version: 'v1', auth: gmailAuth });
    const youtubeAuth = await authorize('youtube', YOUTUBE_SCOPES);
    const youtube = google.youtube({ version: 'v3', auth: youtubeAuth });

    return { gmail, youtube };
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  authorization,
};
