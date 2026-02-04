const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Simulate Moltbook data fetch
io.on('connection', (socket) => {
  setInterval(() => {
    const mockData = {
      temperature: Math.random() * 100,
      pulse: Math.floor(Math.random() * 50),
      mood: ['anxious', 'excited', 'calm'][Math.floor(Math.random() * 3)],
    };
    socket.emit('update', mockData);
  }, 5000); // Update every 5 seconds for testing
});

// Configure logging to a file
const fs = require('fs');
const path = require('path');
const logFilePath = path.join(__dirname, '../logs/backend.log');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logStream.write('Server closed gracefully\n');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    logStream.write('Server closed gracefully\n');
    process.exit(0);
  });
});

// Redirect logs to file and console
console.log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  logStream.write(logMessage);
  process.stdout.write(logMessage);
};

// Test log message to verify logging is working
testLogMessage = () => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] Test log message: Logging is working!\n`;
  logStream.write(logMessage);
  process.stdout.write(logMessage);
};

// Start the server
server.listen(3000, () => {
  console.log('Stoa backend running on port 3000');
  testLogMessage(); // Test logging
});