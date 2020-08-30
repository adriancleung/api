const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const express = require('express');
const morgan = require('morgan');
const app = express();

const SCOPES = [
    'https://www.googleapis.com/auth/gmail.send'
];

const TOKEN_PATH = 'token.json';
const CREDENTIALS_PATH = 'credentials.json';

fs.writeFile(CREDENTIALS_PATH, process.env.credentials_json, (err) => {
    if (err) return console.error(err);
    console.log('Credentials stored to', CREDENTIALS_PATH);
})

fs.writeFile(TOKEN_PATH, process.env.token_json, (err) => {
    if (err) return console.error(err);
    console.log('Token stored to', TOKEN_PATH);
})

function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

function sendMail(auth) {
    from = "From: Adrian Leung <leung.c.adrian@gmail.com>\n";
    to = "To: Adrian Leung <leung.c.adrian@gmail.com>\n";
    subject = "Subject: Contact Form Submitted!\n\n";
    body = "TEST";
    encoded = encode(from + to + subject + body);
    
    const gmail = google.gmail({version: "v1", auth});
    gmail.users.messages.send({
        requestBody: {
            raw: encoded,
        },
        userId: "me",
    });
}

function encode(unencoded) {
    var encoded = new Buffer.from(unencoded).toString('base64');
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.post('/send', (req, res) => {
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        authorize(JSON.parse(content), sendMail);
    });
    res.send('Email sent');
});

const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});