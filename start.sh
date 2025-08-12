#!/bin/bash

echo "🚀 Starting TourMate Application..."

# Check if MongoDB is running
if ! docker ps | grep -q mongodb; then
    echo "📦 Starting MongoDB..."
    docker run -d -p 27017:27017 --name mongodb mongo:6.0
    sleep 5
fi

# Install dependencies if node_modules don't exist
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Seed database
echo "🌱 Seeding database..."
cd backend && npm run seed && cd ..

# Start applications
echo "🎯 Starting applications..."
echo "Frontend will be available at: http://localhost:3000"
echo "Backend will be available at: http://localhost:4000"
echo "API docs will be available at: http://localhost:4000/api/docs"
echo ""
echo "Press Ctrl+C to stop both applications"

# Start both applications
concurrently "cd backend && npm run start:dev" "cd frontend && npm run dev" 