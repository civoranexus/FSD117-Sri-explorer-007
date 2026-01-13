const cityInput = document.getElementById('city-input');
const weatherContent = document.getElementById('weather-content');
const initialState = document.getElementById('initial-state');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');

const cityNameEl = document.getElementById('city-name');
const currentDateEl = document.getElementById('current-date');
const tempEl = document.getElementById('temperature');
const descEl = document.getElementById('description');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const feelsLikeEl = document.getElementById('feels-like');
const weatherIconEl = document.getElementById('weather-icon');

// Date Formatter
const formatDate = () => {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
};

// Weather Code to WMO description & Icon mapping
// Using OpenWeatherMap icons as placeholders mapped to WMO codes
const getWeatherInfo = (code) => {
    // WMO Weather interpretation codes (WW)
    // https://open-meteo.com/en/docs
    const codes = {
        0: { desc: 'Clear sky', icon: '01d' },
        1: { desc: 'Mainly clear', icon: '02d' },
        2: { desc: 'Partly cloudy', icon: '02d' },
        3: { desc: 'Overcast', icon: '04d' },
        45: { desc: 'Fog', icon: '50d' },
        48: { desc: 'Depositing rime fog', icon: '50d' },
        51: { desc: 'Drizzle: Light', icon: '09d' },
        53: { desc: 'Drizzle: Moderate', icon: '09d' },
        55: { desc: 'Drizzle: Dense', icon: '09d' },
        61: { desc: 'Rain: Slight', icon: '10d' },
        63: { desc: 'Rain: Moderate', icon: '10d' },
        65: { desc: 'Rain: Heavy', icon: '10d' },
        71: { desc: 'Snow: Slight', icon: '13d' },
        73: { desc: 'Snow: Moderate', icon: '13d' },
        75: { desc: 'Snow: Heavy', icon: '13d' },
        80: { desc: 'Rain showers: Slight', icon: '09d' },
        81: { desc: 'Rain showers: Moderate', icon: '09d' },
        82: { desc: 'Rain showers: Violent', icon: '09d' },
        95: { desc: 'Thunderstorm', icon: '11d' },
        96: { desc: 'Thunderstorm: Slight Hail', icon: '11d' },
        99: { desc: 'Thunderstorm: Heavy Hail', icon: '11d' },
    };
    
    return codes[code] || { desc: 'Unknown', icon: '03d' };
};

// Search Event Listener
cityInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
        }
    }
});

async function fetchWeatherData(city) {
    showLoading();
    
    try {
        // 1. Geocoding API to get Lat/Lon
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found');
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // 2. Weather API
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m,apparent_temperature`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        updateUI(name, country, weatherData);

    } catch (error) {
        console.error(error);
        showError();
    }
}

function updateUI(city, country, data) {
    const current = data.current_weather;
    const weatherInfo = getWeatherInfo(current.weathercode);
    
    // Attempting to get approx humidity/feels_like from hourly data (closest to current time)
    // Open-Meteo current_weather doesn't give humidity, so we estimate from hourly
    const currentHourIndex = new Date().getHours();
    const humidity = data.hourly.relativehumidity_2m[currentHourIndex];
    const feelsLike = data.hourly.apparent_temperature[currentHourIndex];

    cityNameEl.textContent = `${city}, ${country}`;
    currentDateEl.textContent = formatDate();
    tempEl.innerHTML = `${Math.round(current.temperature)}<span class="unit">°C</span>`;
    descEl.textContent = weatherInfo.desc;
    
    // Updates
    humidityEl.textContent = `${humidity}%`;
    windSpeedEl.textContent = `${current.windspeed} km/h`;
    feelsLikeEl.textContent = `${Math.round(feelsLike)}°C`;
    
    // Icon
    weatherIconEl.src = `https://openweathermap.org/img/wn/${weatherInfo.icon}@4x.png`;

    showContent();
}

function showLoading() {
    initialState.classList.add('hidden');
    weatherContent.classList.add('hidden');
    errorMessage.classList.add('hidden');
    loading.classList.remove('hidden');
}

function showContent() {
    loading.classList.add('hidden');
    errorMessage.classList.add('hidden');
    weatherContent.classList.remove('hidden');
}

function showError() {
    loading.classList.add('hidden');
    weatherContent.classList.add('hidden');
    initialState.classList.add('hidden');
    errorMessage.classList.remove('hidden');
}
