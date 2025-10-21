require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const leadRoutes = require('./routes/leadRoutes');
const { scheduleDailyClear } = require('./utils/cronJobs');
const EmailPoller = require('./utils/emailPoller');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    // Start the email poller
    const emailPoller = new EmailPoller(io);
    emailPoller.start();

    // Pass emailPoller reference to routes (for memory-based data access)
    leadRoutes.setEmailPoller(emailPoller);

    // Routes (must be after emailPoller is created)
    app.use('/api', leadRoutes);

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        message: 'Email Lead Sync Dashboard API is running',
        timestamp: new Date()
      });
    });

    // Serve frontend in production - must be after API routes
    if (process.env.NODE_ENV === 'production') {
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
      });
    }

    // Socket.io connection handler
    io.on('connection', (socket) => {
      console.log('🔌 Client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id);
      });

      socket.on('request-update', async () => {
        console.log('📡 Client requested update');
        // You can manually trigger email check here if needed
      });
    });

    // Schedule daily database clear at 12:00 AM IST
    scheduleDailyClear(io);

    // Start server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📊 Dashboard: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
      console.log(`💓 Health: http://localhost:${PORT}/health\n`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n⏹️  Shutting down gracefully...');
      emailPoller.stop();
      await mongoose.connection.close();
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
