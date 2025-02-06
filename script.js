document.getElementById('getWeatherBtn').addEventListener('click', getWeather);

function getWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showWeather, showError);
    } else {
        document.getElementById('weatherResult').innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showWeather(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = '7e600a47973cd9f9f5927f1178b14122'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const weather = data.weather[0].description;
            const temp = data.main.temp;
            const city = data.name;
            const weatherResult = `
                <p><strong>City:</strong> ${city}</p>
                <p><strong>Temperature:</strong> ${temp}°C</p>
                <p><strong>Weather:</strong> ${weather}</p>
            `;
            document.getElementById('weatherResult').innerHTML = weatherResult;
        })
        .catch(error => {
            document.getElementById('weatherResult').innerHTML = "Error fetching weather data.";
        });
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('weatherResult').innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('weatherResult').innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById('weatherResult').innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById('weatherResult').innerHTML = "An unknown error occurred.";
            break;
    }
}