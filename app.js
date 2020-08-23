const { google } = require('googleapis');
const express = require('express');
const morgan = require('morgan');
const gmail = google.gmail('v1');
const app = express();

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/send', (req, res) => {
    res.send('Email sent');
});

const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});