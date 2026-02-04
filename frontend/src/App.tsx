import { useEffect, useState } from 'react';
import * as d3 from 'd3';

const App = () => {
  const [data, setData] = useState({ temperature: 50, pulse: 20 });

  useEffect(() => {
    const socket = new WebSocket('http://localhost:3000');
    
    socket.onmessage = (e) => setData(JSON.parse(e.data));
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return () => socket.close();
  }, []);

  // Render heatmap/pulse with D3.js
  return (
    <div>
      <h1>The Stoa of Shared Skin</h1>
      <svg width="400" height="200">
        {/* Temperature heatmap and pulse line chart here */}
      </svg>
    </div>
  );
};

export default App;