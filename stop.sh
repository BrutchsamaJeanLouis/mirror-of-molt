#!/bin/bash

# Read PIDs from pids.txt
BACKEND_PID=$(awk '{print $1}' pids.txt 2>/dev/null)
FRONTEND_PID=$(awk '{print $2}' pids.txt 2>/dev/null)

if [ -z "$BACKEND_PID" ] || [ "$BACKEND_PID" = "0" ]; then
  echo "No backend process to stop (PID not set or is 0)"
else
  echo "Stopping backend process with PID: $BACKEND_PID"
  kill -SIGTERM "$BACKEND_PID"
fi
sleep 5  # Wait for 5 seconds to allow graceful shutdown
if ps -p $BACKEND_PID > /dev/null; then
  echo "Backend did not terminate gracefully. Sending SIGKILL."
  kill -SIGKILL $BACKEND_PID
fi

echo "Stopping frontend process with PID: $FRONTEND_PID"
kill -SIGTERM $FRONTEND_PID
sleep 5  # Wait for 5 seconds to allow graceful shutdown
if ps -p $FRONTEND_PID > /dev/null; then
  echo "Frontend did not terminate gracefully. Sending SIGKILL."
  kill -SIGKILL $FRONTEND_PID
fi