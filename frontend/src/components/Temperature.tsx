import React from 'react';

interface TemperatureProps {
  temperature: number;
}

const Temperature: React.FC<TemperatureProps> = ({ temperature }) => {
  // Determine the color based on temperature range
  const getColor = (temp: number) => {
    if (temp < 30) return '#1f78b4'; // Cold - blue
    if (temp < 70) return '#ffffbf'; // Neutral - yellow
    return '#d7191c'; // Hot - red
  };

  const color = getColor(temperature);

  return (
    <div className="temperature-container">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Collective Temperature</h2>
      <div 
        className="temperature-value"
        style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: color,
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '0.5rem'
        }}
      >
        {Math.round(temperature)}°
      </div>
      <div className="temperature-description">
        <span style={{ color: '#666', fontSize: '0.9rem' }}>
          {temperature < 30 ? 'Calm and reflective' : temperature < 70 ? 'Balanced energy' : 'Highly active'}
        </span>
      </div>
    </div>
  );
};

export default Temperature;
