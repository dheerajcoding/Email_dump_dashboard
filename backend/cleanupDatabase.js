require('dotenv').config();
const mongoose = require('mongoose');
const Lead = require('./models/Lead');

async function cleanupDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // 1. Delete old leads without createdDate
    console.log('Step 1: Removing old leads (without createdDate)...');
    const oldResult = await Lead.deleteMany({ createdDate: { $exists: false } });
    console.log(`✅ Deleted ${oldResult.deletedCount} old leads\n`);

    // 2. Delete header rows
    console.log('Step 2: Removing header rows...');
    const headerResult = await Lead.deleteMany({ 'data.__EMPTY': 'PROPOSAL NUMBER' });
    console.log(`✅ Deleted ${headerResult.deletedCount} header rows\n`);

    // 3. Check final count
    const finalCount = await Lead.countDocuments();
    const today = new Date().toISOString().split('T')[0];
    const todayCount = await Lead.countDocuments({ createdDate: today });

    console.log('Final Results:');
    console.log(`  Total leads: ${finalCount}`);
    console.log(`  Today's leads (${today}): ${todayCount}`);

    await mongoose.disconnect();
    console.log('\n✅ Database cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanupDatabase();
