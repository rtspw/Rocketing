'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const port = 5001;

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/resources'));

app.get('/', (req, res) => {
  const url = 'https://launchlibrary.net/1.4/launch?enddate=2018-10-21&startdate=2018-9-21&mode=verbose';
  fetch(url)
    .then(res => res.json())
    .then((data) => {
      res.render('index', data);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get('/launch/:id', (req, res) => {
  const launchID = req.params.id;
  const url = `https://launchlibrary.net/1.4/launch?id=${launchID}&mode=verbose`;
  fetch(url)
    .then(res => res.json())
    .then((data) => {
      res.render('launch-details', data);
    })
    .catch((error) => {
      console.error(error);
    });
})

app.post('/search', (req, res) => {
  const query = req.body.query;
  console.log(req.body);
  const url = `https://launchlibrary.net/1.4/launch?name=${query}&mode=verbose`;
  fetch(url)
    .then(res => res.json())
    .then((data) => {
      res.render('index', data);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.listen(port, () => {
  console.log(`Now serving port ${port}`);
})