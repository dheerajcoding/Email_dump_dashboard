#!/bin/bash
# Render Build Script
# This script is automatically run during Render deployment

echo "🚀 Starting Render deployment build..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Build frontend
echo "🏗️ Building frontend..."
npm run build
cd ..

echo "✅ Build completed successfully!"
echo "📊 Built files are in frontend/dist/"
