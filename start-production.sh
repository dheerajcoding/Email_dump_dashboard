#!/bin/bash
# Production Start Script
# This script is used by Render to start the application

echo "🚀 Starting Email Lead Sync Dashboard..."
echo "📊 Environment: $NODE_ENV"
echo "🔌 Port: $PORT"

# Navigate to backend directory
cd backend

# Start the server
echo "✅ Starting server..."
node server.js
