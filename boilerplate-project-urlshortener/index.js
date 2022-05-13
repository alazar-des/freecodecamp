require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nanoid = require('nanoid');
const validUrl = require('valid-url');

const app = express();

const nanoId = nanoid.customAlphabet('1234567890', 4);

mongoose.connect('mongodb+srv://alazar:dwuZaLCfj833qd8H@cluster0.vpbjg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

const urlSchema = new mongoose.Schema({
  'originalURL': String,
  'shortURL': Number
});

const URL = mongoose.model('URL', urlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  if (validUrl.isWebUri(req.body.url)) {
    const shortId = nanoId();
    const url = new URL({ originalURL: req.body.url, shortURL: shortId});
    url.save(function (err) {
      if (err) return console.log(err);
      res.json({ "original_url": req.body.url, "short_url": shortId})
    })
  } else {
    res.json({ error: "Invalid URL" });
  }
});

app.get('/api/shorturl/:shorturl', function(req, res) {
  URL.findOne({shortURL: req.params.shorturl}, function(err, url) {
    if (err) return console.log(err);
    res.redirect(url.originalURL);
  })
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
