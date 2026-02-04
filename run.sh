#!/bin/bash

# Create logs directory if it doesn't exist
mkdir -p logs

# Start backend server in detached mode and stream logs
echo "Starting backend server..."
nohup node backend/server.js > logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
echo "$BACKEND_PID" > pids.txt

# Start frontend in detached mode on port 3001 and stream logs
echo "Starting frontend on port 3001..."
nohup cd frontend && npm start -- --port=3001 > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
echo "$BACKEND_PID $FRONTEND_PID" > pids.txt

echo "Server and UI started successfully in detached mode."
echo "Backend logs: tail -f logs/backend.log"
echo "Frontend logs: tail -f logs/frontend.log"