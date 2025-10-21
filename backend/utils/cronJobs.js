const cron = require('node-cron');

// Schedule daily memory clear at 12:00 AM IST (midnight)
// Note: This just notifies - actual clearing happens in emailPoller when it runs
function scheduleDailyClear(io) {
  // Cron format: minute hour * * *
  // 0 0 * * * means 12:00 AM (midnight) every day
  
  const cronExpression = '0 0 * * *'; // 12:00 AM IST

  cron.schedule(cronExpression, async () => {
    console.log('⏰ [CRON] New day started - memory will be cleared on next email check...');
    
    // Notify all connected clients
    if (io) {
      io.emit('new-day', {
        message: 'New day started - leads will be refreshed',
        timestamp: new Date(),
        newDate: new Date().toISOString().split('T')[0]
      });
    }
  }, {
    timezone: "Asia/Kolkata" // IST timezone
  });

  console.log('✅ [CRON] Daily notification scheduled for 12:00 AM IST (midnight)');
}

module.exports = {
  scheduleDailyClear
};
