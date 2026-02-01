require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db.config');

// Seed admin user
const seedAdmin = async () => {
    try {
        await connectDB();

        // Check if admin already exists
        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });

        if (adminExists) {
            console.log('⚠️  Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: process.env.ADMIN_EMAIL || 'admin@bookstore.com',
            password: process.env.ADMIN_PASSWORD || 'Admin@123',
            role: 'admin'
        });

        console.log('✅ Admin user created successfully');
        console.log(`📧 Email: ${admin.email}`);
        console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
        console.log('\n⚠️  IMPORTANT: Please change the admin password after first login!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
