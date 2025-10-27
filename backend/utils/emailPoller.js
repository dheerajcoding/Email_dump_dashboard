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
    console.log('🚀 [POLLER] Starting email poller (checks every 10 minutes)');
    
    // Run immediately on start
    this.processEmails();

    // Then run every 10 minutes
    this.pollInterval = setInterval(() => {
      this.processEmails();
    }, 10 * 60 * 1000); // 10 minutes in milliseconds

    console.log('✅ [POLLER] Email poller started successfully');
  }

  stop() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
      console.log('🛑 [POLLER] Email poller stopped');
    }
  }
}

module.exports = EmailPoller;
