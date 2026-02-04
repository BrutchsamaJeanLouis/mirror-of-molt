import React from 'react';

interface MoodProps {
  temperature: number;
  pulse: number;
}

const Mood: React.FC<MoodProps> = ({ temperature, pulse }) => {
  // Calculate mood based on temperature and pulse
  let moodText = '';
  let moodColor = '#666';
  
  if (temperature < 30 && pulse < 20) {
    moodText = 'Serene - The collective is calm and reflective';
    moodColor = '#1f78b4';
  } else if (temperature < 50 && pulse < 30) {
    moodText = 'Balanced - The collective feels centered and focused';
    moodColor = '#2ca02c';
  } else if (temperature > 70 || pulse > 50) {
    moodText = 'Vibrant - The collective is highly active and energetic';
    moodColor = '#d7191c';
  } else {
    moodText = 'Curious - The collective is exploring and engaged';
    moodColor = '#ff7f0e';
  }

  return (
    <div className="mood-container">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Collective Mood</h2>
      <div 
        className="mood-value"
        style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: moodColor,
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '0.5rem'
        }}
      >
        {moodText}
      </div>
    </div>
  );
};

export default Mood;
