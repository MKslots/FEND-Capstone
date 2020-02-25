var path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express()
const fetch = require('node-fetch');


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('dist'))
app.use(cors());


// designates what port the app will listen to for incoming requests
app.listen(1010, function () {
    console.log('app listening on http://localhost:1010/')
})

app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
})

app.get('/', (req, res) => {
  res.sendFile('dist/index.html')
})

app.post('/darkSkyPost', async (req,res) => {
  const data = await fetch(req.body.url);
  console.log(req.body.url);
  const weatherData = await data.json();
  const darkSkyAPI = {
    tempHigh: Math.round(weatherData.daily.data[0].temperatureHigh),
    tempLow: Math.round(weatherData.daily.data[0].temperatureLow),
    summary: weatherData.daily.data[0].summary
  }
  res.send(darkSkyAPI);
});

module.exports = app
