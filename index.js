'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/resources'));

app.get('/', (req, res) => {

  const getDateRange = function() {
    const date = new Date();
    let today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    date.setMonth(date.getMonth() - 3);
    let lastMonth = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return { today, lastMonth };
  }

  const dateLimit = getDateRange();
  const url = `https://launchlibrary.net/1.4/launch?enddate=${dateLimit.today}&startdate=${dateLimit.lastMonth}&mode=verbose&limit=50`;
  
  fetch(url)
    .then(res => res.json())
    .then((data) => {
      const dataObj = { launches: [] };
      data.launches.forEach((launch, i) => {

        let id = 0;
        let name = 'Unavaliable';
        let time = 'Unavaliable';
        let location = 'Unavaliable';
        let lsp = 'Unavaliable';
        let imageURL = '';

        try { id = launch.id; }
        catch (e) { console.error(e.message) };
        try { name = launch.name; }
        catch (e) { console.error(e.message) };
        try { time = launch.windowstart.split(' ').slice(0, 3).join(' '); }
        catch (e) { console.error(e.message) };
        try { location = launch.location.name; }
        catch (e) { console.error(e.message) };
        try { lsp = launch.lsp.name; }
        catch (e) { console.error(e.message) };
        try { imageURL = launch.rocket.imageURL; }
        catch (e) { console.error(e.message) };

        dataObj.launches[i] = {
          id, name, time, location, lsp, imageURL
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

      if (video === undefined) video = '';

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
  const url = `https://launchlibrary.net/1.4/launch?name=${query}&mode=verbose&limit=50`;
  fetch(url)
    .then(res => res.json())
    .then((data) => {
      const dataObj = { launches: [] };
      data.launches.forEach((launch, i) => {

        let id = 0;
        let name = 'Unavaliable';
        let time = 'Unavaliable';
        let location = 'Unavaliable';
        let lsp = 'Unavaliable';
        let imageURL = '';

        try { id = launch.id }
        catch(e) { console.error(e) }
        try { name = launch.name; }
        catch(e) { console.error(e) }
        try { time = launch.windowstart.split(' ').slice(0, 3).join(' '); }
        catch(e) { console.error(e) }
        try { location = launch.location.name; }
        catch(e) { console.error(e) }
        try { lsp = launch.lsp.name; }
        catch(e) { console.error(e) }
        try { imageURL = launch.rocket.imageURL; } 
        catch(e) { console.error(e) }

        dataObj.launches[i] = {
          id, name, time, location, lsp, imageURL
        };
      });
      res.render('index', dataObj);
    })
    .catch((error) => {
      console.error(error);
      res.send('There was an error.');
    });
});

app.get('*', (req, res) => {
  res.redirect('/');
})

app.listen(port, () => {
  console.log(`Now serving port ${port}`);
})