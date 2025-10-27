const emailService = require('../services/emailService');
const excelService = require('../services/excelService');

class EmailPoller {
  constructor(io) {
    this.io = io;
    this.isPolling = false;
    this.pollInterval = null;
    this.todaysLeads = []; // Store today's leads in memory only
    this.maxLeadsInMemory = 10000; // ⚡ Limit to prevent memory overflow on free tier
  }

  async processEmails() {
    if (this.isPolling) {
      console.log('⏭️  Polling already in progress, skipping...');
      return;
    }

    this.isPolling = true;
    console.log('🔄 [POLLER] Starting email check...');

    try {
      // Get today's date string (YYYY-MM-DD)
      const todayDate = new Date().toISOString().split('T')[0];
      
      // Get today's date in the format used in email subject (e.g., "19-October-2025")
      const today = new Date();
      const subjectDate = today.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }).replace(/ /g, '-');
      
      // Fetch emails with today's date in subject
      const emails = await emailService.fetchEmailsByDate(subjectDate);

      if (emails.length === 0) {
        console.log('📭 [POLLER] No emails found for today');
        this.isPolling = false;
        return;
      }

      console.log(`📬 [POLLER] Found ${emails.length} email(s) for ${subjectDate}`);
      
      // ⚡ PRODUCTION FIX: Process only the LATEST email to prevent memory overflow
      // Sort by date (newest first) and take only the first one
      const latestEmail = emails.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      console.log(`📧 [POLLER] Processing LATEST email only: ${latestEmail.subject}`);

      // Clear previous leads (fresh start each time)
      this.todaysLeads = [];
      let totalLeadsAdded = 0;

      // Process only the latest email
      const emailsToProcess = [latestEmail];
      
      for (const email of emailsToProcess) {
        try {
          // Parse Excel attachments
          const excelData = excelService.parseAllAttachments(email.attachments);

          if (excelData.length === 0) {
            console.log('⚠️  No data found in attachments');
            continue;
          }

          console.log(`📊 Extracted ${excelData.length} rows from ${email.attachmentNames.join(', ')}`);

          // Store in memory only (no database)
          const leads = excelData.map((row, index) => ({
            _id: `${Date.now()}_${index}`, // Temporary ID for frontend
            data: row,
            emailSubject: email.subject,
            emailDate: email.date,
            fileName: email.attachmentNames.join(', '),
            fetchedAt: new Date(),
            date: todayDate
          }));

          // ⚡ MEMORY SAFETY: Check if adding these leads would exceed the limit
          if (this.todaysLeads.length + leads.length > this.maxLeadsInMemory) {
            console.log(`⚠️  Memory limit reached! Current: ${this.todaysLeads.length}, Incoming: ${leads.length}, Max: ${this.maxLeadsInMemory}`);
            // Keep only the most recent leads
            const available = this.maxLeadsInMemory - this.todaysLeads.length;
            if (available > 0) {
              this.todaysLeads.push(...leads.slice(0, available));
              totalLeadsAdded += available;
              console.log(`⚠️  Added only ${available} leads to stay within memory limit`);
            } else {
              console.log(`❌ Cannot add more leads - memory full`);
            }
          } else {
            this.todaysLeads.push(...leads);
            totalLeadsAdded += leads.length;
          }

          console.log(`✅ Stored ${Math.min(leads.length, this.maxLeadsInMemory - (this.todaysLeads.length - totalLeadsAdded))} leads in memory for ${todayDate}`);

          // Emit real-time update to all connected clients
          if (this.io) {
            const leadsToEmit = Math.min(leads.length, this.maxLeadsInMemory - (this.todaysLeads.length - totalLeadsAdded));
            this.io.emit('new-leads', {
              count: leadsToEmit,
              leads: leads.slice(0, leadsToEmit),
              email: {
                subject: email.subject,
                date: email.date,
                fileName: email.attachmentNames.join(', ')
              }
            });
            console.log('📡 Emitted real-time update to clients');
          }
          
          // ⚡ Clear processed data from memory
          excelData.length = 0;
          leads.length = 0;
        } catch (error) {
          console.error('❌ Error processing email:', error.message);
        }
      }

      console.log(`✨ [POLLER] Total leads in memory for today: ${totalLeadsAdded}`);

      // Cleanup files
      excelService.cleanupTempDirectory();
      
      // Disconnect from email server
      await emailService.disconnect();
      
      // ⚡ Force garbage collection if available
      if (global.gc) {
        global.gc();
        console.log('🧹 Triggered garbage collection');
      }

    } catch (error) {
      console.error('❌ [POLLER] Error during email polling:', error.message);
    } finally {
      this.isPolling = false;
    }
  }
  
  // Get today's leads from memory
  getTodaysLeads() {
    console.log(`📊 [MEMORY] Returning ${this.todaysLeads.length} leads from memory`);
    return this.todaysLeads;
  }

  start() {
    console.log('🚀 [POLLER] Starting email poller (checks every 2 hours at :05 minutes)');
    
    // Calculate next check time (every 2 hours at :05 minutes: 12:05, 2:05, 4:05, etc.)
    const getNextCheckTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      // Find next 2-hour interval (0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22)
      let nextHour = Math.floor(currentHour / 2) * 2;
      
      // If we're past :05 minutes, move to next 2-hour slot
      if (currentMinute >= 5) {
        nextHour += 2;
      }
      
      // Handle day overflow
      if (nextHour >= 24) {
        nextHour = nextHour % 24;
      }
      
      const nextCheck = new Date(now);
      nextCheck.setHours(nextHour, 5, 0, 0); // Set to :05 minutes
      
      // If calculated time is in the past, add 2 hours
      if (nextCheck <= now) {
        nextCheck.setHours(nextCheck.getHours() + 2);
      }
      
      return nextCheck;
    };
    
    const scheduleNextCheck = () => {
      const nextTime = getNextCheckTime();
      const delay = nextTime - new Date();
      
      console.log(`⏰ Next email check scheduled at: ${nextTime.toLocaleString()} (in ${Math.round(delay / 60000)} minutes)`);
      
      this.pollInterval = setTimeout(() => {
        this.processEmails();
        scheduleNextCheck(); // Schedule the next check after this one completes
      }, delay);
    };
    
    // Run immediately on start
    console.log('🔄 Running initial email check...');
    this.processEmails();
    
    // Schedule the next check
    scheduleNextCheck();

    console.log('✅ [POLLER] Email poller started successfully');
  }

  stop() {
    if (this.pollInterval) {
      clearTimeout(this.pollInterval); // Changed from clearInterval to clearTimeout
      this.pollInterval = null;
      console.log('🛑 [POLLER] Email poller stopped');
    }
  }
}

module.exports = EmailPoller;
