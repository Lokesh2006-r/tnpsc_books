const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const connectDB = require('../config/db.config');

const promoteUserToAdmin = async () => {
    try {
        await connectDB();

        // Find the most recently created user
        const user = await User.findOne().sort({ createdAt: -1 });

        if (!user) {
            console.log('No users found in database.');
            process.exit(1);
        }

        console.log(`Found user: ${user.name} (${user.email})`);

        user.role = 'admin';
        await user.save();

        console.log(`✅ Successfully promoted ${user.name} to ADMIN.`);
        console.log('You can now access the Admin Panel.');

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

promoteUserToAdmin();
