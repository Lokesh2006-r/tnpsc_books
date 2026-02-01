require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
    console.log('🔍 Testing MongoDB Connection...');
    console.log(`📡 URI: ${process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@')}`); // Hide password in log

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ SUCCESS: Connected to MongoDB Atlas!');

        // List collections to be sure
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📚 Collections found: ${collections.length}`);
        collections.forEach(c => console.log(`   - ${c.name}`));

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ FAILED: Could not connect to MongoDB');
        console.error(`   Error: ${error.message}`);
        process.exit(1);
    }
};

testConnection();
