const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');

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
    const limit = parseInt(req.query.limit) || 500; // Default to 500 leads per page
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

// Export all leads to Excel
router.get('/leads/export', async (req, res) => {
  try {
    if (!emailPoller) {
      return res.status(503).json({
        success: false,
        message: 'Email poller not initialized'
      });
    }

    // Get all leads from memory
    const allLeads = emailPoller.getTodaysLeads();
    
    if (allLeads.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No leads to export'
      });
    }

    // Prepare data for Excel
    const excelData = allLeads.map((lead, index) => {
      const row = {
        '#': index + 1,
        ...lead.data,
        'File Name': lead.fileName,
        'Fetched At': new Date(lead.fetchedAt).toLocaleString(),
        'Date': lead.date
      };
      return row;
    });

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Auto-size columns
    const cols = Object.keys(excelData[0] || {}).map(key => ({ wch: Math.max(key.length, 15) }));
    worksheet['!cols'] = cols;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set headers and send file
    const todayDate = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=leads_${todayDate}.xlsx`);
    res.send(buffer);

    console.log(`📥 Exported ${allLeads.length} leads to Excel`);
  } catch (error) {
    console.error('❌ Error exporting leads:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting leads',
      error: error.message
    });
  }
});

module.exports = router;
