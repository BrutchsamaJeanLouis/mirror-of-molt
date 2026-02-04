import React from 'react';
import * as d3 from 'd3';

interface HeatmapProps {
  temperature: number;
}

const Heatmap: React.FC<HeatmapProps> = ({ temperature }) => {
  // Create a color scale from blue (cold) to red (hot)
  const colorScale = d3.scaleLinear()
    .domain([0, 50, 100])
    .range(['#1f78b4', '#ffffbf', '#d7191c'])
    .clamp(true);

  // Calculate the color based on temperature
  const fillColor = colorScale(temperature);

  return (
    <div className="heatmap-container">
      <svg width="300" height="200" viewBox="0 0 300 200">
        {/* Background grid */}
        {[...Array(5)].map((_, row) => (
          [...Array(6)].map((_, col) => (
            <rect
              key={`${row}-${col}`}
              x={col * 40}
              y={row * 30}
              width="38"
              height="28"
              fill={colorScale(Math.min(100, temperature + (Math.random() - 0.5) * 20))}
              stroke="#ccc"
              strokeWidth="1"
            />
          ))
        ))}
      </svg>
      <div className="heatmap-legend">
        <span style={{ color: '#1f78b4' }}>Cold</span>
        <span style={{ color: '#ffffbf', margin: '0 20px' }}>Neutral</span>
        <span style={{ color: '#d7191c' }}>Hot</span>
      </div>
    </div>
  );
};

export default Heatmap;