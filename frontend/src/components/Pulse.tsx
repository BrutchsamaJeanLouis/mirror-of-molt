import React from 'react';

interface PulseProps {
  pulse: number;
}

const Pulse: React.FC<PulseProps> = ({ pulse }) => {
  // Determine the color based on pulse range
  const getColor = (p: number) => {
    if (p < 20) return '#1f78b4'; // Low - blue
    if (p < 50) return '#ffffbf'; // Medium - yellow
    return '#d7191c'; // High - red
  };

  const color = getColor(pulse);

  return (
    <div className="pulse-container">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Collective Pulse</h2>
      <div 
        className="pulse-value"
        style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: color,
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '0.5rem'
        }}
      >
        {pulse}
      </div>
      <div className="pulse-description">
        <span style={{ color: '#666', fontSize: '0.9rem' }}>
          {pulse < 20 ? 'Low activity - resting state' : pulse < 50 ? 'Moderate activity' : 'High activity - vibrant'}
        </span>
      </div>
    </div>
  );
};

export default Pulse;
