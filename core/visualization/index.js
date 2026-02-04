// Visualization Module
// Handles D3.js visualizations for collective psychology

const d3 = require('d3');

/**
 * Generate temperature heatmap SVG
 * @param {number} temperature - Temperature score (0-100)
 * @returns {string} SVG string representing the heatmap
 */
exports.generateTemperatureHeatmap = (temperature) => {
  const width = 400;
  const height = 200;
  
  // Normalize temperature to color scale (red to blue)
  const colorScale = d3.scaleLinear()
    .domain([0, 50, 100])
    .range(['#ff0000', '#ffff00', '#0000ff']);
  
  const color = colorScale(temperature);
  
  // Create gradient for heatmap effect
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  svg += `<defs>`;
  svg += `<linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="100%">`;
  svg += `<stop offset="0%" style="stop-color:${color};stop-opacity:0.7" />`;
  svg += `<stop offset="100%" style="stop-color:${color};stop-opacity:0.3" />`;
  svg += `</linearGradient>`;
  svg += `</defs>`;
  
  // Draw heatmap rectangle
  svg += `<rect x="50" y="50" width="${width - 100}" height="${height - 100}"`;
  svg += ` fill="url(#tempGradient)" stroke="#333" stroke-width="2"/>`;
  
  // Add temperature label
  const tempLabel = Math.round(temperature);
  svg += `<text x="${width / 2}" y="${height - 30}" text-anchor="middle" font-family="Arial" font-size="16" fill="#333">`;
  svg += `Temperature: ${tempLabel}`;
  svg += `</text>`;
  
  // Add color scale legend
  const legendWidth = 200;
  const legendHeight = 20;
  svg += `<rect x="50" y="${height - 40}" width="${legendWidth}" height="${legendHeight}"`;
  svg += ` fill="url(#tempGradient)" stroke="#333" stroke-width="1"/>`;
  svg += `<text x="50" y="${height - 20}" font-family="Arial" font-size="12" fill="#333">Low</text>`;
  svg += `<text x="${width / 2}" y="${height - 20}" text-anchor="middle" font-family="Arial" font-size="12" fill="#333">Neutral</text>`;
  svg += `<text x="${width - 50}" y="${height - 20}" text-anchor="end" font-family="Arial" font-size="12" fill="#333">High</text>`;
  
  svg += `</svg>`;
  
  return svg;
};

/**
 * Generate pulse line chart SVG
 * @param {Array} pulseData - Array of pulse values over time
 * @returns {string} SVG string representing the line chart
 */
exports.generatePulseChart = (pulseData) => {
  const width = 400;
  const height = 200;
  
  // Create sample data if none provided
  const data = pulseData || Array.from({ length: 10 }, () => Math.floor(Math.random() * 50));
  
  const xScale = d3.scaleLinear()
    .domain([0, data.length - 1])
    .range([50, width - 50]);
  
  const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height - 50, 50]);
  
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  
  // Draw grid lines
  svg += `<g stroke="#e0e0e0">`;
  for (let i = 0; i <= 5; i++) {
    const y = height - 50 - (i * (height - 100) / 5);
    svg += `<line x1="50" y1="${y}" x2="${width - 50}" y2="${y}" stroke-width="1"/>`;
  }
  svg += `</g>`;
  
  // Draw line
  svg += `<path fill="none" stroke="#4a90e2" stroke-width="2" d="M`;
  data.forEach((value, index) => {
    const x = xScale(index);
    const y = yScale(value);
    svg += `${index === 0 ? 'M' : 'L'}${x},${y}`;
  });
  svg += `"/>`;
  
  // Add data points
  data.forEach((value, index) => {
    const x = xScale(index);
    const y = yScale(value);
    svg += `<circle cx="${x}" cy="${y}" r="3" fill="#4a90e2"/>`;
  });
  
  // Add labels
  svg += `<text x="50" y="30" font-family="Arial" font-size="14" fill="#333">Pulse (Activity)</text>`;
  svg += `<text x="${width - 50}" y="${height - 20}" text-anchor="end" font-family="Arial" font-size="12" fill="#666">Last ${data.length} readings</text>`;
  
  // Add Y-axis labels
  [0, 25, 50, 75, 100].forEach(label => {
    const y = yScale(label);
    svg += `<text x="40" y="${y + 4}" text-anchor="end" font-family="Arial" font-size="12" fill="#666">${label}</text>`;
  });
  
  svg += `</svg>`;
  
  return svg;
};

/**
 * Generate mood visualization SVG
 * @param {Object} mood - Mood object with percentages
 * @returns {string} SVG string representing the mood chart
 */
exports.generateMoodChart = (mood) => {
  const width = 400;
  const height = 200;
  
  const colors = {
    curious: '#9b59b6',
    anxious: '#e74c3c',
    excited: '#f1c40f'
  };
  
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  
  // Draw arcs for each mood
  const radius = Math.min(width, height) / 2 - 30;
  const centerX = width / 2;
  const centerY = height / 2;
  
  let startAngle = 0;
  Object.entries(mood).forEach(([moodType, percentage]) => {
    const endAngle = startAngle + (percentage / 100) * 360;
    const x1 = centerX + radius * Math.cos(startAngle * Math.PI / 180);
    const y1 = centerY + radius * Math.sin(startAngle * Math.PI / 180);
    const x2 = centerX + radius * Math.cos(endAngle * Math.PI / 180);
    const y2 = centerY + radius * Math.sin(endAngle * Math.PI / 180);
    
    svg += `<path d="M${centerX},${centerY} L${x1},${y1} A${radius},${radius} 0 ${endAngle > 90 ? '1' : '0'} 1 ${x2},${y2} Z"`;
    svg += ` fill="${colors[moodType]}" stroke="#333" stroke-width="1"/>`;
    
    // Add label
    const labelAngle = startAngle + (endAngle - startAngle) / 2;
    const labelX = centerX + (radius * 0.7) * Math.cos(labelAngle * Math.PI / 180);
    const labelY = centerY + (radius * 0.7) * Math.sin(labelAngle * Math.PI / 180);
    svg += `<text x="${labelX}" y="${labelY}" text-anchor="middle" font-family="Arial" font-size="12" fill="white">${moodType} ${percentage}%</text>`;
    
    startAngle = endAngle;
  });
  
  // Add center label
  svg += `<circle cx="${centerX}" cy="${centerY}" r="50" fill="none" stroke="#333" stroke-width="1"/>`;
  svg += `<text x="${centerX}" y="${centerY + 8}" text-anchor="middle" font-family="Arial" font-size="14" fill="#333">Collective Mood</text>`;
  
  svg += `</svg>`;
  
  return svg;
};