const path = require('path');
const express = require('express');
const request = require('request');
const hbs = require('hbs');

const app = express();
const partialsPath = path.join(__dirname, 'views/partials');
const weatherUrl = "http://api.weatherstack.com/current?access_key=b444caa32388688ddb4bdda2ac639d9f&query=Hebron,%20Palestine";
let data;

app.use(express.static('public'));
app.set('view engine', 'hbs');
hbs.registerPartials(partialsPath);

const options = {
    method: 'GET',
    json: true
};

request(weatherUrl, options, (error, res, body) => {
    if (error) {
        return  console.log(error);
    }

    if (!error && res.statusCode == 200) {
        data = {
            query: body['request']['query'],
            temp: body['current']['temperature'],
            icon: body['current']['weather_icons'][0],
            windSpeed: body['current']['wind_speed'],
            pressure: body['current']['pressure']
        };
        
        console.log(data);
    };
});

app.get('', (req, res) => {
    res.render('home', {
        query: data['query'],
        welcomeMessage: "Welcome to Weather App",
        imageUrl: 'https://knoww.cc/wp-content/uploads/2018/07/3233-1.gif'
    });
});

app.get('/weather', (req, res) => {
    res.render('weather', data);
});

app.listen(3000, () => {
    console.log('Connecting on port 3000...')
});
