const express = require('express');
const router = express.Router();

// This will be set by server.js after emailPoller is created
let emailPoller = null;

// Middleware to set emailPoller reference
router.setEmailPoller = (poller) => {
  emailPoller = poller;
};

// GET all leads (with pagination) - from memory only, no database
router.get('/leads', async (req, res) => {
  try {
    if (!emailPoller) {
      return res.status(503).json({
        success: false,
        message: 'Email poller not initialized'
      });
    }

    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // Default to 50 leads per page
    const skip = (page - 1) * limit;
    
    // Get today's date string (YYYY-MM-DD)
    const todayDate = new Date().toISOString().split('T')[0];
    
    // Get leads from memory (not database)
    const allLeads = emailPoller.getTodaysLeads();
    const totalLeads = allLeads.length;
    
    // Apply pagination
    const paginatedLeads = allLeads.slice(skip, skip + limit);
    
    res.json({
      success: true,
      count: paginatedLeads.length,
      total: totalLeads,
      page,
      totalPages: Math.ceil(totalLeads / limit),
      date: todayDate,
      data: paginatedLeads
    });
  } catch (error) {
    console.error('❌ Error fetching leads:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leads',
      error: error.message
    });
  }
});

// GET lead statistics - from memory only
router.get('/stats', async (req, res) => {
  try {
    if (!emailPoller) {
      return res.status(503).json({
        success: false,
        message: 'Email poller not initialized'
      });
    }

    // Get today's date string (YYYY-MM-DD)
    const todayDate = new Date().toISOString().split('T')[0];
    
    const allLeads = emailPoller.getTodaysLeads();
    const totalLeads = allLeads.length;
    const latestLead = allLeads.length > 0 ? allLeads[allLeads.length - 1] : null;
    
    res.json({
      success: true,
      data: {
        totalLeads,
        latestUpdate: latestLead ? latestLead.fetchedAt : null,
        currentDate: todayDate
      }
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

module.exports = router;
