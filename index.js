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
      const dataObj = { launches: [] };
      data.launches.forEach((launch, i) => {
        dataObj.launches[i] = {
          id: launch.id,
          name: launch.name,
          time: launch.windowstart.split(' ').slice(0, 3).join(' '),
          location: launch.location.name,
          lsp: launch.lsp.name,
          imageURL: launch.rocket.imageURL,
        };
      });
      res.render('index', dataObj);
    })
    .catch((error) => {
      console.error(error);
      res.send('There was an error.');
    });
});

app.get('/launch/:id', (req, res) => {
  const launchID = req.params.id;
  const url = `https://launchlibrary.net/1.4/launch?id=${launchID}&mode=verbose`;
  fetch(url)
    .then(res => res.json())
    .then((data) => {
      let mission = '';
      let location = 'Unavaliable';
      let pad = 'Unavaliable';
      let rocket = 'Unavaliable';
      let lsp = 'Unavaliable';
      let lat = 0;
      let long = 0;
      let video = '';

      try { mission = data.launches[0].missions[0].description }
      catch (e) { console.error(e.message) };
      try { location = data.launches[0].location.name }
      catch (e) { console.error(e.message) };
      try { pad = data.launches[0].location.pads[0].name }
      catch (e) { console.error(e.message) };
      try { rocket = data.launches[0].rocket.familyname }
      catch (e) { console.error(e.message) };
      try { lsp = data.launches[0].lsp.name }
      catch (e) { console.error(e.message) };
      try { lat = data.launches[0].location.pads[0].latitude }
      catch (e) { console.error(e.message) };
      try { long = data.launches[0].location.pads[0].longitude }
      catch (e) { console.error(e.message) };
      try { video = data.launches[0].vidURLs[0] }
      catch (e) { console.error(e.message) };

      if (video.includes('https://www.youtube.com/watch?v=')) {
        const code = video.substr(32);
        video = `https://www.youtube.com/embed/${code}`;
      }
      const dataObj = {
        name: data.launches[0].name,
        mission, location, pad, lat, long, rocket, lsp, video,
        imageURL: data.launches[0].rocket.imageURL,
      };
      res.render('launch-details', dataObj);
    })
    .catch((error) => {
      console.error(error);
      res.send('There was an error.');
    });
})

app.post('/search', (req, res) => {
  const query = req.body.query;
  const url = `https://launchlibrary.net/1.4/launch?name=${query}&mode=verbose`;
  fetch(url)
    .then(res => res.json())
    .then((data) => {
      const dataObj = { launches: [] };
      data.launches.forEach((launch, i) => {
        dataObj.launches[i] = {
          id: launch.id,
          name: launch.name,
          time: launch.windowstart.split(' ').slice(0, 3).join(' '),
          location: launch.location.name,
          lsp: launch.lsp.name,
          imageURL: launch.rocket.imageURL,
        };
      });
      res.render('index', dataObj);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get('*', (req, res) => {
  res.redirect('/');
})

app.listen(port, () => {
  console.log(`Now serving port ${port}`);
})