const apiData = {};
const date = document.getElementById('travelDate'); 

// API keys

const geonamesUserName = 'slots';
const darkSkyAPIKey = 'e5a0ca8307de2af238797a9c244e0ba8';
const pixaBayAPIKey = '13597640-6537f5e72b9b29e03f1404b81';

// GEONAMES API

export const getCoordinates = async (location) => {
    const url = `http://api.geonames.org/searchJSON?q=${location}&maxRows=10&username=${geonamesUserName}`;
    const getData = await fetch(url);
    try {
            if (getData.status !== 200) {
                throw new Error("Error 200");
            }
            else {
                const data = await getData.json();
                const coordData = {
                    lat: data.geonames[0].lat,
                    lon: data.geonames[0].lng,
                    country: data.geonames[0].countryName,
                    countryCode: data.geonames[0].countryCode,
                    city: data.geonames[0].name
                }
                apiData.coord = coordData;
                console.log(apiData);
            }
        } catch(error) {
            alert('Invalid location');
            return false;
        }
}

// DARKSKY API

const getWeather = async (apiData, date) => {

    const unixDate = Math.round(new Date(date.value).getTime()/1000);
    const unixToday = Math.round(new Date().getTime()/1000);
    const unixDaysBtwn = unixDate - unixToday;
    const daysBtwn = Math.round(unixDaysBtwn/86400);
    const lati = apiData.coord.lat;
    const long = apiData.coord.lon;
    const url = (daysBtwn > 7) ? `https://api.darksky.net/forecast/${darkSkyAPIKey}/${lati},${long},${unixDate}`:`https://api.darksky.net/forecast/${darkSkyAPIKey}/${lati},${long}`;
    const getData = await fetch('http://localhost:1010/darkSkyPost', {
        method: 'POST',
        cache: 'no-cache', 
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({url: url})
      })
      const data = await getData.json();
      apiData.weather = data;
      apiData.date = daysBtwn + 1;
}

// PIXABAY API

const getPicture = async (location) => {

    const country = apiData.coord.country;
    const newLocation = location.replace(/\s+/g, '%20');
    const countryURL = `https://pixabay.com/api/?key=${pixaBayAPIKey}&q=${country}&orientation=horizontal`;
    const locationURL = `https://pixabay.com/api/?key=${pixaBayAPIKey}&q=${newLocation},${country}&orientation=horizontal`;

    const getData = await fetch(locationURL);
    const data = await getData.json();
    if (data.hits.length > 0) {
        const picData = {
            url: data.hits[0].webformatURL
        }
        apiData.picture = picData;
    } else {
        const getData = await fetch(countryURL);
        console.log(countryURL)
        const data = await getData.json();
        const picData = {
            url: data.hits[0].webformatURL
        }
        apiData.picture = picData;
    }     
}


// UI update

const UIupdate = () => {
    const inputDate = date.value; 
    const formatDate = new Date(inputDate).toLocaleDateString('en-UK', {timeZone: 'UTC'});
    const countdown = apiData.date;
    const dayNum = (countdown === 1) ? 'day' : 'days';
    document.getElementById('timing').innerHTML = `Your travel begins in ${countdown} ${dayNum}!`;
    document.getElementById('travelSum').innerHTML = `Travel to ${apiData.coord.city}, ${apiData.coord.country}, departing on ${formatDate}.`;
    document.getElementById('travelPic').src = apiData.picture.url;
    if (apiData.weather.summary == undefined) {
        document.getElementById('weatherSum').innerHTML = `Weather Forecast: Temperatures from ${apiData.weather.tempLow}&#8457;, to ${apiData.weather.tempHigh}&#8457;` ;
    }
    else {
        document.getElementById('weatherSum').innerHTML = `Weather Forecast: ${apiData.weather.summary} Temperatures from ${apiData.weather.tempLow}&#8457;, to ${apiData.weather.tempHigh}&#8457;`;
    }
}


// EXPORT FUNCTION 

export const handleAPIData = async (location) => {
    getCoordinates(location).then(() => getWeather(apiData,date)).then(() => 
    getPicture(location)).then(()=> UIupdate(apiData));
}
