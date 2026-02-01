require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore');

        console.log('============================================================');
        console.log('  ADMIN USER SETUP');
        console.log('============================================================\n');

        const existingAdmin = await User.findOne({ email: 'admin@bookstore.com' });

        if (existingAdmin) {
            console.log('STATUS: Admin user already exists\n');
            console.log('LOGIN CREDENTIALS:');
            console.log('  Email:    admin@bookstore.com');
            console.log('  Password: admin123');
            console.log('  Role:     ' + existingAdmin.role);
            console.log('  Active:   ' + existingAdmin.isActive + '\n');

            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('ACTION: Updated user to admin role\n');
            }
        } else {
            const adminUser = await User.create({
                name: 'Admin',
                email: 'admin@bookstore.com',
                password: 'admin123',
                role: 'admin',
                isActive: true
            });

            console.log('STATUS: New admin user created!\n');
            console.log('LOGIN CREDENTIALS:');
            console.log('  Email:    admin@bookstore.com');
            console.log('  Password: admin123');
            console.log('  Role:     ' + adminUser.role + '\n');
        }

        const allUsers = await User.find({}).select('name email role isActive');
        console.log('============================================================');
        console.log('  ALL USERS (' + allUsers.length + ' total)');
        console.log('============================================================\n');

        allUsers.forEach((user, index) => {
            console.log((index + 1) + '. ' + user.email);
            console.log('   Name:   ' + user.name);
            console.log('   Role:   ' + user.role);
            console.log('   Active: ' + user.isActive + '\n');
        });

        console.log('============================================================');
        console.log('  Login at: http://localhost:3000/login');
        console.log('============================================================');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('\nERROR:', error.message + '\n');
        process.exit(1);
    }
};

createAdminUser();
