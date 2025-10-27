const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const fs = require('fs');
const path = require('path');

class EmailService {
  constructor() {
    this.client = null;
    this.config = {
      host: process.env.IMAP_HOST,
      port: parseInt(process.env.IMAP_PORT),
      secure: process.env.IMAP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      logger: false
    };
  }

  async connect() {
    try {
      this.client = new ImapFlow(this.config);
      await this.client.connect();
      console.log(' Connected to IMAP server');
      return true;
    } catch (error) {
      console.error(' IMAP Connection Error:', error.message);
      return false;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.logout();
      console.log(' Disconnected from IMAP server');
    }
  }

  async fetchEmailsByDate(targetDate = null) {
    try {
      if (!this.client) {
        await this.connect();
      }

      await this.client.mailboxOpen('INBOX');

      const senderEmail = process.env.SENDER_EMAIL;
      const subjectPattern = process.env.SUBJECT_PATTERN;

      // If no date provided, use today
      if (!targetDate) {
        const today = new Date();
        targetDate = today.toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }).replace(/ /g, '-');
      }

      console.log('🔍 Searching for emails from:', senderEmail);
      console.log('📅 Looking for date in subject:', targetDate);

      const emailsWithAttachments = [];
      let processedCount = 0;
      let skippedCount = 0;
      let totalCount = 0;
      
      // ⚡ MEMORY OPTIMIZATION: Process emails one by one instead of loading all into memory
      // Fetch recent emails only (last 30 days) to reduce memory usage
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      for await (let message of this.client.fetch({
        from: senderEmail,
        since: thirtyDaysAgo
      }, {
        envelope: true,
        source: true
      }, { maxBytes: 20 * 1024 * 1024 })) { // Limit to 20MB per email
        totalCount++;
        
        try {
          const parsed = await simpleParser(message.source);
          
          // Check if subject matches pattern
          if (subjectPattern && !parsed.subject.includes(subjectPattern)) {
            continue;
          }

          // Check if subject contains today's date
          if (!parsed.subject.includes(targetDate)) {
            skippedCount++;
            continue;
          }

          console.log('📨 Processing:', parsed.subject);
          processedCount++;

          if (parsed.attachments && parsed.attachments.length > 0) {
            const excelAttachments = parsed.attachments.filter(att => {
              const filename = att.filename.toLowerCase();
              return filename.endsWith('.xlsx') || 
                     filename.endsWith('.xls') || 
                     filename.endsWith('.csv');
            });

            if (excelAttachments.length > 0) {
              const tempDir = path.join(__dirname, '../temp');
              if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
              }

              const attachmentPaths = [];

              for (const attachment of excelAttachments) {
                const timestamp = Date.now();
                const filePath = path.join(tempDir, timestamp + '_' + attachment.filename);
                fs.writeFileSync(filePath, attachment.content);
                attachmentPaths.push(filePath);
                console.log('💾 Saved:', attachment.filename);
              }

              emailsWithAttachments.push({
                subject: parsed.subject,
                date: parsed.date,
                from: parsed.from.text,
                attachments: attachmentPaths,
                attachmentNames: excelAttachments.map(a => a.filename)
              });
            }
          }
          
          // Clear parsed email from memory immediately after processing
          parsed.attachments = null;
          message.source = null;
          
        } catch (parseError) {
          console.error('❌ Error parsing email:', parseError.message);
        }
        
        // Force garbage collection hint after every 10 emails (if available)
        if (totalCount % 10 === 0 && global.gc) {
          global.gc();
        }
      }

      console.log(`📧 Scanned ${totalCount} emails from sender (last 30 days)`);
      console.log(`✅ Processed ${processedCount} emails with today's date`);
      console.log(`⏭️  Skipped ${skippedCount} emails (different dates)`);

      return emailsWithAttachments;
    } catch (error) {
      console.error('❌ Error fetching emails:', error.message);
      throw error;
    }
  }
}

module.exports = new EmailService();
