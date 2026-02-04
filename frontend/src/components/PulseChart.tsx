import React from 'react';
import * as d3 from 'd3';

interface PulseChartProps {
  pulseHistory: number[];
}

const PulseChart: React.FC<PulseChartProps> = ({ pulseHistory }) => {
  // Create a line generator
  const line = d3.line()
    .x((_, i) => i * 40 + 20) // Position each point horizontally
    .y(d => 150 - d * 2.5) // Scale pulse value to SVG height
    .curve(d3.curveMonotoneX);

  return (
    <div className="pulse-chart-container">
      <svg width="400" height="200" viewBox="0 0 400 200">
        {/* Grid lines */}
        {[...Array(5)].map((_, i) => (
          <g key={`grid-${i}`}>
            <line x1="0" y1={i * 30 + 20} x2="400" y2={i * 30 + 20} stroke="#ddd" />
            <text x="-30" y={i * 30 + 25} textAnchor="end" fill="#666">
              {Math.floor((4 - i) * 10)}
            </text>
          </g>
        ))}

        {/* Line chart */}
        <path 
          d={line(pulseHistory)}
          fill="none"
          stroke="#4a90e2"
          strokeWidth="3"
        />

        {/* Data points */}
        {pulseHistory.map((point, i) => (
          <circle 
            key={`point-${i}`}
            cx={i * 40 + 20}
            cy={150 - point * 2.5}
            r="4"
            fill="#4a90e2"
          />
        ))}
      </svg>
    </div>
  );
};

export default PulseChart;