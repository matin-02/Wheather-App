import React from 'react';
import { convertTemperature } from './Helper';

const WeeklyForecast = ({ data, unit }) => {
  return (
    <div className="mt-4">
      <h3 className="text-2xl font-bold text-center mb-4 text-white/90">5-Day Forecast</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.map((day, idx) => {
          const date = new Date(day.dt_txt).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          });

          return (
            <div
              key={idx}
              className="flex items-center justify-between gap-4 bg-gradient-to-br from-purple-600 to-indigo-700 p-4 rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt={day.weather[0].description}
                  className="w-12 h-12 animate-bounce-slow"
                />
                <div>
                  <p className="font-semibold text-white">{date}</p>
                  <p className="text-sm text-white/80 capitalize">{day.weather[0].description}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-white">
                  {convertTemperature(day.main.temp_max, unit)}&deg; /{' '}
                  {convertTemperature(day.main.temp_min, unit)}&deg;
                </p>
                <p className="text-sm text-white/70">Max / Min</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyForecast;
