const fs = require('fs');
const util = require('util');
const readline = require('readline');
const { google } = require('googleapis');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const readFileContent = util.promisify(fs.readFile);

const SCOPES = [
    'https://www.googleapis.com/auth/gmail.send'
];

const TOKEN_PATH = 'token.json';
const CREDENTIALS_PATH = 'credentials.json';

var firstName;
var lastName;
var email;
var message;

fs.writeFile(CREDENTIALS_PATH, process.env.credentials_json, (err) => {
    if (err) return console.error(err);
    console.log('Credentials stored to', CREDENTIALS_PATH);
})

fs.writeFile(TOKEN_PATH, process.env.token_json, (err) => {
    if (err) return console.error(err);
    console.log('Token stored to', TOKEN_PATH);
})

async function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    return await readFileContent(TOKEN_PATH)
    .then(async buff => {
        oAuth2Client.setCredentials(JSON.parse(buff));
        return await callback(oAuth2Client);
    })
    .catch(err => {
        return getNewToken(oAuth2Client, callback);
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

async function sendMail(auth) {
    from = "From:  Adrian Leung <leung.c.adrian@gmail.com>\n";
    to = "To: Adrian Leung <adrian.leung@ualberta.ca>\n";
    subject = "Subject: Contact Form Submitted!\n\n";
    body = firstName + " " + lastName + " (" + email + ") sent you a message:\n" + message;
    encoded = encode(from + to + subject + body);
    
    const gmail = google.gmail({version: "v1", auth});
    const res = await gmail.users.messages.send({
        requestBody: {
            raw: encoded,
        },
        userId: "me",
    });

    if (res.data.labelIds.includes('SENT')) {
        console.log('Email sent!');
        return 200;
    } else {
        console.error('ERROR: Email not sent!');
        return 500;
    }
}

function encode(unencoded) {
    var encoded = new Buffer.from(unencoded).toString('base64');
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    next();
});

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.post('/send', cors(), (req, res) => {
    firstName = req.body.firstName;
    lastName = req.body.lastName;
    email = req.body.email;
    message = req.body.message;

    fs.readFile('credentials.json', async (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        await authorize(JSON.parse(content), sendMail)
        .then(statusCode => {
            if (statusCode === 200) {
                res.status(200).send();
            } else {
                res.status(500).send();
            }
        });
    });
});

const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});