const { google } = require('googleapis');
const express = require('express');
const gmail = google.gmail('v1');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/send', (req, res) => {
    res.send('Email sent');
});

app.listen(3000, () => {
    console.log('Example app listening at http://localhost:3000');
});