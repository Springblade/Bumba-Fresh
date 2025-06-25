#!/bin/bash

echo "🚀 Starting Bumba Fresh Development Environment..."
echo ""

# Check if PostgreSQL is running
echo "📊 Checking PostgreSQL connection..."
if ! timeout 3 bash -c 'echo > /dev/tcp/localhost/5432'; then
    echo "❌ PostgreSQL not accessible on localhost:5432"
    echo "Please start PostgreSQL first"
    exit 1
fi
echo "✅ PostgreSQL is running"
echo ""

# Start backend server
echo "🔧 Starting Backend Server (Port 8000)..."
cd backend
node src/index.js &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 3

# Check if backend is running
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend server is running"
else
    echo "❌ Backend server failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🌐 Starting Frontend Server (Port 5173)..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Development environment started!"
echo "📍 Backend:  http://localhost:8000"
echo "📍 Frontend: http://localhost:5173"
echo "📍 API Test: http://localhost:5173/test-api-connection.html"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
