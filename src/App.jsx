import React, { useEffect, useState } from 'react';
import WeatherBackground from './components/WheatherBackground';
import WeeklyForecast from './components/WeeklyForecast';
import {
  convertTemperature,
  getVisibilityValue,
  getWindDirection,
  getHumidityValue
} from './components/Helper';
import {
  HumidityIcon,
  VisibilityIcon,
  WindIcon
} from './components/Icons';

const App = () => {
  const [weather, setWeather] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [city, setCity] = useState('');
  const [suggestion, setSuggestion] = useState([]);
  const [unit, setUnit] = useState('C');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  );

  const API_KEY = '3fd37a26281a856362103ad9ff70bc1e';

  useEffect(() => {
    const root = document.documentElement;
    darkMode ? root.classList.add('dark') : root.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    if (city.trim().length >= 3 && !weather) {
      const timer = setTimeout(() => fetchSuggestions(city), 500);
      return () => clearTimeout(timer);
    }
    setSuggestion([]);
  }, [city, weather]);

  const fetchSuggestions = async (query) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      res.ok ? setSuggestion(await res.json()) : setSuggestion([]);
    } catch {
      setSuggestion([]);
    }
  };

  const fetchWeatherData = async (url, name = '') => {
    setError('');
    setWeather(null);
    setWeeklyForecast([]);

    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error((await response.json()).message || 'City not found');

      const data = await response.json();
      setWeather(data);
      setCity(name || data.name);
      setSuggestion([]);

      const lat = data.coord.lat;
      const lon = data.coord.lon;

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!forecastResponse.ok) throw new Error('Forecast fetch failed');

      const forecastData = await forecastResponse.json();
      const dailyMap = {};

      forecastData.list.forEach((entry) => {
        const date = entry.dt_txt.split(' ')[0];
        if (!dailyMap[date]) dailyMap[date] = entry;
      });

      const dailyForecast = Object.values(dailyMap).slice(0, 5);
      setWeeklyForecast(dailyForecast);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return setError('Please enter a valid city');
    await fetchWeatherData(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`
    );
  };

  const getWeatherCondition = () =>
    weather && {
      main: weather.weather[0].main,
      isDay:
        Date.now() / 1000 > weather.sys.sunrise &&
        Date.now() / 1000 < weather.sys.sunset
    };

  return (
    <div className="min-h-screen relative font-sans transition-colors duration-500">
      <WeatherBackground condition={getWeatherCondition()} />

      {/* Dark Mode Toggle */}
      <button
        onClick={() => {
          setDarkMode((prev) => {
            localStorage.setItem('theme', !prev ? 'dark' : 'light');
            return !prev;
          });
        }}
        className="absolute top-4 right-4 z-50 px-4 py-2 text-sm text-white rounded-full bg-gradient-to-br from-purple-700 to-indigo-600 hover:opacity-90 transition"
      >
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <div className="flex justify-center items-center p-6 min-h-screen relative z-10">
        <div className="w-full max-w-3xl md:max-w-4xl rounded-xl shadow-2xl p-10 text-white bg-white/10 backdrop-blur-md border border-white/30">
          <h1 className="text-4xl font-bold text-center mb-6 drop-shadow-md">
            WeatherApp 🌤️
          </h1>

          {!weather ? (
            <form onSubmit={handleSearch} className="relative">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter City"
                className="w-full mb-4 p-3 rounded-lg bg-white/20 border border-white/40 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
              {suggestion.length > 0 && (
                <div className="absolute top-14 left-0 right-0 bg-black/60 rounded-lg shadow-lg border border-white/20 z-20">
                  {suggestion.map((s) => (
                    <button
                      key={`${s.lat}-${s.lon}`}
                      type="button"
                      onClick={() =>
                        fetchWeatherData(
                          `https://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=${s.lon}&appid=${API_KEY}&units=metric`,
                          `${s.name}, ${s.country}${s.state ? `, ${s.state}` : ''}`
                        )
                      }
                      className="w-full text-left px-4 py-2 text-sm hover:bg-purple-700 transition"
                    >
                      {s.name}, {s.country}
                      {s.state && `, ${s.state}`}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition"
              >
                Get Weather
              </button>
              {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
            </form>
          ) : (
            <div className="transition-opacity duration-500">
              <button
                onClick={() => {
                  setWeather(null);
                  setCity('');
                  setWeeklyForecast([]);
                }}
                className="mb-4 bg-pink-800 hover:bg-pink-700 text-white py-1 px-3 rounded-md"
              >
                🔍 New Search
              </button>

              <div className="flex justify-between items-center mb-2">
                <h2 className="text-3xl font-bold">{weather.name}</h2>
                <button
                  onClick={() => setUnit((u) => (u === 'C' ? 'F' : 'C'))}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1 px-3 rounded"
                >
                  &deg;{unit}
                </button>
              </div>

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="mx-auto my-4 animate-bounce"
              />

              <p className="text-4xl font-bold mb-1">
                {convertTemperature(weather.main.temp, unit)} &deg;{unit}
              </p>
              <p className="capitalize text-lg text-white/80">
                {weather.weather[0].description}
              </p>

              <div className="flex justify-around flex-wrap mt-6 gap-4">
                {[
                  [HumidityIcon, 'Humidity', `${weather.main.humidity}% (${getHumidityValue(weather.main.humidity)})`],
                  [WindIcon, 'Wind', `${weather.wind.speed} m/s ${getWindDirection(weather.wind)}`],
                  [VisibilityIcon, 'Visibility', getVisibilityValue(weather.visibility)]
                ].map(([Icon, label, value]) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <Icon className="w-6 h-6 animate-pulse" />
                    <p className="font-semibold">{label}</p>
                    <p className="text-sm text-white/80">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-sm text-white/80 space-y-1">
                <p><strong>Feels Like:</strong> {convertTemperature(weather.main.feels_like, unit)} &deg;{unit}</p>
                <p><strong>Pressure:</strong> {weather.main.pressure} hPa</p>
              </div>

              {weeklyForecast.length > 0 && (
                <div className="mt-8">
                  <WeeklyForecast data={weeklyForecast} unit={unit} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
