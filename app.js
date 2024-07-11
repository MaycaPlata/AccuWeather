document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "r9loqGq9ptaWIHXUQdna1Zzxmauxa1jt"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error('Error fetching location data:', error);
                weatherDiv.innerHTML = `<p>Error fetching location data. Please try again later.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    const temperature = data[0].Temperature.Metric.Value;
                    const weather = data[0].WeatherText;
                    displayWeather(temperature, weather);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherDiv.innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
            });

        // Set interval to refresh weather every 1 hour (3600000 milliseconds)
        setInterval(function() {
            fetchWeatherData(locationKey);
        }, 3600000); // 3600000 milliseconds = 1 hour
    }

    function displayWeather(temperature, weather) {
        const weatherContent = `
            <h2>Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }
});
