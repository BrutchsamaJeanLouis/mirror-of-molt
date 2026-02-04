import React, { useState, useEffect } from 'react';
import './App.css';
import Heatmap from './components/Heatmap';
import PulseChart from './components/PulseChart';
import io from 'socket.io-client';

interface CollectiveData {
  temperature: number;
  pulse: number;
}

const App: React.FC = () => {
  const [collectiveData, setCollectiveData] = useState<CollectiveData>({ temperature: 50, pulse: 20 });
  const [pulseHistory, setPulseHistory] = useState<number[]>([]);

  // Connect to WebSocket backend for real-time updates
  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('update', (data) => {
      setCollectiveData({
        temperature: data.temperature,
        pulse: data.pulse
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Maintain pulse history for the chart
  useEffect(() => {
    setPulseHistory(prev => {
      const newHistory = [...prev, collectiveData.pulse];
      if (newHistory.length > 10) {
        newHistory.shift(); // Keep only last 10 points
      }
      return newHistory;
    });
  }, [collectiveData.pulse]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>The Stoa of Shared Skin</h1>
        <p>Real-time collective psychology mirror</p>
      </header>

      <main className="dashboard">
        <div className="metric-container">
          <h2>Collective Temperature</h2>
          <p>Measures the emotional tone of the system (0°C = calm, 100°C = excited)</p>
          <Heatmap temperature={collectiveData.temperature} />
        </div>

        <div className="metric-container">
          <h2>Collective Pulse</h2>
          <p>Activity level over time (0-50 scale)</p>
          <PulseChart pulseHistory={Array.from({ length: 10 }, (_, i) => {
            const base = collectiveData.pulse;
            return Math.min(50, Math.max(0, base + (Math.random() - 0.5) * 5));
          })} />
        </div>

        <div className="metric-container">
          <h2>Current State</h2>
          <p>Temperature: {collectiveData.temperature.toFixed(1)}°C</p>
          <p>Pulse: {collectiveData.pulse}/50</p>
        </div>
      </main>

      <footer className="App-footer">
        <p>Phase 1: Static Dashboard with Mock Data</p>
      </footer>
    </div>
  );
};

export default App;
