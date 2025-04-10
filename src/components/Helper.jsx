// Converts wind degree into compass direction
export const getWindDirection = (deg) => {
  if (typeof deg !== 'number') return '';
  if (deg > 337.5 || deg <= 22.5) return 'N';
  if (deg > 22.5 && deg <= 67.5) return 'NE';
  if (deg > 67.5 && deg <= 112.5) return 'E';
  if (deg > 112.5 && deg <= 157.5) return 'SE';
  if (deg > 157.5 && deg <= 202.5) return 'S';
  if (deg > 202.5 && deg <= 247.5) return 'SW';
  if (deg > 247.5 && deg <= 292.5) return 'W';
  if (deg > 292.5 && deg <= 337.5) return 'NW';
  return '';
};

// Gives a human-readable description of humidity
export const getHumidityValue = (humidity) => {
  if (typeof humidity !== 'number') return '';
  if (humidity < 30) return 'Low';
  if (humidity < 60) return 'Moderate';
  return 'High';
};

// Converts visibility from meters to kilometers with one decimal
export const getVisibilityValue = (visibility) => {
  if (typeof visibility !== 'number') return '';
  return `${(visibility / 1000).toFixed(1)} km`;
};

// Converts temperature to Celsius or Fahrenheit
export const convertTemperature = (temp, unit) => {
  if (typeof temp !== 'number') return '';
  return unit === 'F'
    ? ((temp * 9) / 5 + 32).toFixed(1)
    : temp.toFixed(1);
};
