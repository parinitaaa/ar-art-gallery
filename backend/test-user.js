require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ar-art-gallery');
    console.log('Connected');
    try {
        const u = new User({ name: 'Test', email: 'test3@test.com', password: 'test', role: 'visitor' });
        await u.save();
        console.log('Saved');
    } catch(e) {
        console.error('Error saving:', e);
    }
    process.exit(0);
}
test();
