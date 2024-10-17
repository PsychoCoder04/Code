
const API_KEY = 'API KEY PLEASE';
const BASE_URL = 'https://api.weatherapi.com/v1';

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherSection = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

async function getWeatherData(city) {
    try {
        const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5`);

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        displayCurrentWeather(data.current, data.location);
        displayForecast(data.forecast);
    } catch (error) {
        console.error('Error:', error);
        currentWeatherSection.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        forecastSection.innerHTML = '';
    }
}

function displayCurrentWeather(current, location) {
    const html = `
        <h2>${location.name}, ${location.country}</h2>
        <p>Temperature: ${current.temp_c.toFixed(1)}°C</p>
        <p>Feels like: ${current.feelslike_c.toFixed(1)}°C</p>
        <p>Humidity: ${current.humidity}%</p>
        <p>Wind Speed: ${current.wind_kph} km/h</p>
        <p>Weather: ${current.condition.text}</p>
        <img src="${current.condition.icon}" alt="${current.condition.text}">
    `;
    currentWeatherSection.innerHTML = html;
}

function displayForecast(forecast) {
    let html = '<h2>5-Day Forecast</h2>';
    
    forecast.forecastday.forEach(day => {
        const date = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        html += `
            <div class="forecast-day">
                <h3>${date}</h3>
                <p>Max Temp: ${day.day.maxtemp_c.toFixed(1)}°C</p>
                <p>Min Temp: ${day.day.mintemp_c.toFixed(1)}°C</p>
                <p>Weather: ${day.day.condition.text}</p>
                <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            </div>
        `;
    });

    forecastSection.innerHTML = html;
}

// Optional: Load weather for a default city on page load
document.addEventListener('DOMContentLoaded', () => getWeatherData('London'));
