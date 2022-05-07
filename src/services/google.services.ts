import { google } from 'googleapis';
import readline from 'readline';

enum ApiType {
  YOUTUBE = 'YOUTUBE',
}

const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const YOUTUBE_SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl'];

const authorize = async (api: ApiType, scope: string[]) => {
  const envTokenString = `${api}_TOKEN`;
  const credentials = JSON.parse(process.env[`${api}_CREDENTIALS`]);
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

  const code: string = await new Promise(resolve =>
    rl.question('Enter the code from that page here: ', answer =>
      resolve(answer)
    )
  );
  rl.close();
  const { tokens } = await oAuth2Client.getToken(code);
  console.info(
    `Set environment variable ${envTokenString} to the following: `,
    JSON.stringify(tokens)
  );
  return tokens;
};

const youtube = async () => {
  if (!process.env.YOUTUBE_CREDENTIALS) {
    throw new Error('Error loading YouTube client secrets');
  }

  try {
    const youtubeAuth = await authorize(ApiType.YOUTUBE, YOUTUBE_SCOPES);
    const youtube = google.youtube({ version: 'v3', auth: youtubeAuth });
    return youtube;
  } catch (err) {
    console.error(err);
  }
};

export { youtube };
