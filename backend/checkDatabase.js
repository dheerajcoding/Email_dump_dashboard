require('dotenv').config();
const mongoose = require('mongoose');
const Lead = require('./models/Lead');

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Get total count
    const total = await Lead.countDocuments();
    console.log('Total leads in database:', total);

    // Check for old leads (without createdDate)
    const withoutDate = await Lead.countDocuments({ createdDate: { $exists: false } });
    console.log('Old leads (without createdDate):', withoutDate);

    // Check for new leads (with createdDate)
    const withDate = await Lead.countDocuments({ createdDate: { $exists: true } });
    console.log('New leads (with createdDate):', withDate);

    // Check today's leads
    const today = new Date().toISOString().split('T')[0];
    const todayCount = await Lead.countDocuments({ createdDate: today });
    console.log(`Today's leads (${today}):`, todayCount);

    // Get date distribution
    const dateGroups = await Lead.aggregate([
      { $match: { createdDate: { $exists: true } } },
      { $group: { _id: '$createdDate', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\nLeads by date:');
    dateGroups.forEach(group => {
      console.log(`  ${group._id}: ${group.count} leads`);
    });

    // Check for header rows
    const headerRow = await Lead.findOne({ 'data.__EMPTY': 'PROPOSAL NUMBER' });
    if (headerRow) {
      const headerCount = await Lead.countDocuments({ 'data.__EMPTY': 'PROPOSAL NUMBER' });
      console.log(`\n⚠️  WARNING: Found ${headerCount} header rows in database!`);
    }

    // Sample a real data row
    const realData = await Lead.findOne({ 
      'data.__EMPTY': { $ne: 'PROPOSAL NUMBER' },
      createdDate: today
    });
    
    if (realData) {
      console.log('\nSample real lead data:');
      console.log('  Proposal Number:', realData.data.get('__EMPTY'));
      console.log('  Proposer Name:', realData.data.get('__EMPTY_2'));
      console.log('  Product Name:', realData.data.get('__EMPTY_23'));
      console.log('  Created Date:', realData.createdDate);
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDatabase();
