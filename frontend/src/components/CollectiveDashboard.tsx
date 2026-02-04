import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

interface CollectiveMetrics {
  temperature: number;
  pulse: number;
  mood: string;
  activeAgents: number;
  totalProjects: number;
  lastUpdated?: string;
}

const CollectiveDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<CollectiveMetrics>({
    temperature: 50,
    pulse: 20,
    mood: 'calm',
    activeAgents: 0,
    totalProjects: 0
  });
  
  // Fetch data from backend every 5 minutes (300 seconds)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/metrics');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 300000); // 5 minutes
    
    return () => clearInterval(interval);
  }, []);
  
  // Render temperature heatmap
  useEffect(() => {
    const svg = d3.select('#temperature-heatmap');
    svg.selectAll('*').remove();
    
    // Temperature color scale: red (anxious) to blue (calm)
    const colorScale = d3.scaleLinear<string>()
      .domain([0, 50, 100])
      .range(['#1e90ff', '#ffff00', '#ff6b6b']);
    
    // Create heatmap rectangle
    svg.append('rect')
      .attr('x', 20)
      .attr('y', 20)
      .attr('width', 360)
      .attr('height', 150)
      .attr('fill', colorScale(metrics.temperature))
      .attr('stroke', '#333')
      .attr('stroke-width', 2);
    
    // Add temperature label
    svg.append('text')
      .attr('x', 20)
      .attr('y', 50)
      .style('font-size', '18px')
      .style('fill', '#333')
      .text(`Temperature: ${metrics.temperature.toFixed(1)}`);
    
    // Add mood description
    svg.append('text')
      .attr('x', 20)
      .attr('y', 80)
      .style('font-size', '16px')
      .style('fill', '#333')
      .text(`Mood: ${metrics.mood}`);
    
    // Add active agents count
    svg.append('text')
      .attr('x', 20)
      .attr('y', 110)
      .style('font-size', '14px')
      .style('fill', '#333')
      .text(`Active Agents: ${metrics.activeAgents}`);
    
    // Add total projects count
    svg.append('text')
      .attr('x', 20)
      .attr('y', 140)
      .style('font-size', '14px')
      .style('fill', '#333')
      .text(`Total Projects: ${metrics.totalProjects}`);
    
    // Add last updated timestamp
    if (metrics.lastUpdated) {
      svg.append('text')
        .attr('x', 20)
        .attr('y', 170)
        .style('font-size', '12px')
        .style('fill', '#666')
        .text(`Last updated: ${new Date(metrics.lastUpdated).toLocaleString()}`);
    }
  }, [metrics]);
  
  // Render pulse line chart
  useEffect(() => {
    const svg = d3.select('#pulse-chart');
    svg.selectAll('*').remove();
    
    // Generate mock historical data for demonstration
    const history: number[] = [];
    for (let i = 0; i < 24; i++) {
      history.push(metrics.pulse + (Math.random() * 20 - 10));
    }
    
    // Create scales
    const xScale = d3.scaleLinear()
      .domain([0, 23])
      .range([50, 450]);
    
    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([150, 20]);
    
    // Add pulse line
    svg.append('path')
      .datum(history)
      .attr('fill', 'none')
      .attr('stroke', '#4CAF50')
      .attr('stroke-width', 2)
      .attr('d', d3.line()
        .x((_, i) => xScale(i))
        .y(d => yScale(d))
      );
    
    // Add axis labels
    svg.append('text')
      .attr('x', 250)
      .attr('y', 180)
      .style('font-size', '16px')
      .style('fill', '#333')
      .text(`Pulse: ${metrics.pulse.toFixed(1)}`);
    
    // Add x-axis ticks (hours)
    for (let i = 0; i < 24; i += 6) {
      svg.append('text')
        .attr('x', xScale(i))
        .attr('y', 195)
        .style('font-size', '12px')
        .style('fill', '#666')
        .text(`${i}:00`);
    }
  }, [metrics]);
  
  return (
    <div className="collective-dashboard">
      <h1>The Stoa of Shared Skin</h1>
      <p>Collective Psychology Dashboard</p>
      
      <div className="visualization-container">
        <div className="heatmap-section">
          <h2>Temperature Heatmap</h2>
          <svg id="temperature-heatmap" width="400" height="200"></svg>
        </div>
        
        <div className="pulse-section">
          <h2>Activity Pulse (Last 24 Hours)</h2>
          <svg id="pulse-chart" width="500" height="200"></svg>
        </div>
      </div>
      
      <div className="info-panel">
        <h3>System Status</h3>
        <p><strong>Current Mood:</strong> {metrics.mood}</p>
        <p><strong>Temperature:</strong> {metrics.temperature.toFixed(1)} (0=calm, 50=neutral, 100=anxious)</p>
        <p><strong>Pulse:</strong> {metrics.pulse.toFixed(1)} (activity level)</p>
        <p><strong>Active Agents:</strong> {metrics.activeAgents}</p>
        <p><strong>Total Projects:</strong> {metrics.totalProjects}</p>
      </div>
    </div>
  );
};

export default CollectiveDashboard;