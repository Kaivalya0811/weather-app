// ============================================================
//  Atmosphère — Weather Dashboard | script.js
// ============================================================
//
//  HOW TO USE:
//  1. Get a free API key at https://openweathermap.org/api
//  2. Replace the placeholder below with your actual key.
//  3. Open index.html in a browser and search for any city!
//
// ============================================================

const API_KEY = '8440ad98a5f380338c0979e5c84f1b77'; // <-- Replace with your OpenWeatherMap key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// ── DOM References ──────────────────────────────────────────
const cityInput   = document.getElementById('cityInput');
const searchBtn   = document.getElementById('searchBtn');
const weatherCard = document.getElementById('weatherCard');
const loader      = document.getElementById('loader');
const errorMsg    = document.getElementById('errorMsg');

const cityNameEl  = document.getElementById('cityName');
const countryEl   = document.getElementById('country');
const weatherIcon = document.getElementById('weatherIcon');
const tempEl      = document.getElementById('temperature');
const conditionEl = document.getElementById('condition');
const humidityEl  = document.getElementById('humidity');
const windEl      = document.getElementById('windSpeed');
const visibilityEl= document.getElementById('visibility');
const feelsLikeEl = document.getElementById('feelsLike');
const updatedAtEl = document.getElementById('updatedAt');

// ── Event Listeners ─────────────────────────────────────────
searchBtn.addEventListener('click', handleSearch);

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSearch();
});

// ── Main Search Handler ──────────────────────────────────────
function handleSearch() {
  const city = cityInput.value.trim();

  if (!city) {
    showError('Please enter a city name.');
    return;
  }

  fetchWeather(city);
}

// ── Fetch Weather from OpenWeatherMap ────────────────────────
async function fetchWeather(city) {
  showLoader(true);
  hideError();
  hideCard();

  if (API_KEY === 'YOUR_API_KEY_HERE') {
    showLoader(false);
    showError('⚠ Please add your OpenWeatherMap API key in script.js');
    return;
  }

  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found. Please check the spelling.');
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Check your key in script.js.');
      } else {
        throw new Error(`Something went wrong (${response.status}).`);
      }
    }

    const data = await response.json();
    renderWeather(data);

  } catch (err) {
    showError(err.message);
  } finally {
    showLoader(false);
  }
}

// ── Render Weather Data ──────────────────────────────────────
function renderWeather(data) {
  const {
    name,
    sys: { country },
    main: { temp, feels_like, humidity },
    weather: [{ description, icon }],
    wind: { speed },
    visibility,
  } = data;

  cityNameEl.textContent   = name;
  countryEl.textContent    = country;
  tempEl.textContent       = Math.round(temp);
  conditionEl.textContent  = description;
  humidityEl.textContent   = `${humidity}%`;
  windEl.textContent       = `${speed} m/s`;
  visibilityEl.textContent = visibility ? `${(visibility / 1000).toFixed(1)} km` : 'N/A';
  feelsLikeEl.textContent  = `${Math.round(feels_like)}°C`;

  // Weather icon from OpenWeatherMap
  weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  weatherIcon.alt = description;

  // Timestamp
  const now = new Date();
  updatedAtEl.textContent = `Updated at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  showCard();
}

// ── UI Helpers ───────────────────────────────────────────────
function showLoader(visible) {
  loader.classList.toggle('visible', visible);
}

function showCard() {
  weatherCard.classList.add('visible');
}

function hideCard() {
  weatherCard.classList.remove('visible');
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.add('visible');
}

function hideError() {
  errorMsg.classList.remove('visible');
  errorMsg.textContent = '';
}
