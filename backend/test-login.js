require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const testLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore');

        console.log('\n=== TESTING LOGIN FUNCTIONALITY ===\n');

        // Test credentials
        const testEmail = 'admin@bookstore.com';
        const testPassword = 'admin123';

        console.log('1. Looking for user:', testEmail);
        const user = await User.findOne({ email: testEmail }).select('+password');

        if (!user) {
            console.log('   ❌ User NOT found in database!');
            console.log('   Creating admin user...\n');

            const newAdmin = await User.create({
                name: 'Admin',
                email: testEmail,
                password: testPassword,
                role: 'admin',
                isActive: true
            });

            console.log('   ✅ Admin user created!');
            console.log('   Email:', newAdmin.email);
            console.log('   Role:', newAdmin.role);
        } else {
            console.log('   ✅ User found!');
            console.log('   Name:', user.name);
            console.log('   Email:', user.email);
            console.log('   Role:', user.role);
            console.log('   Active:', user.isActive);
            console.log('   Has password:', !!user.password);
        }

        console.log('\n2. Testing password comparison...');
        const isMatch = await user.comparePassword(testPassword);

        if (isMatch) {
            console.log('   ✅ Password matches!');
        } else {
            console.log('   ❌ Password does NOT match!');
            console.log('   Resetting password to "admin123"...');

            user.password = testPassword;
            await user.save();

            console.log('   ✅ Password reset complete!');
        }

        console.log('\n3. Final verification...');
        const finalUser = await User.findOne({ email: testEmail }).select('+password');
        const finalMatch = await finalUser.comparePassword(testPassword);

        if (finalMatch) {
            console.log('   ✅ Login will work!');
            console.log('\n=== LOGIN CREDENTIALS ===');
            console.log('Email:    ' + testEmail);
            console.log('Password: ' + testPassword);
            console.log('Role:     ' + finalUser.role);
            console.log('========================\n');
        } else {
            console.log('   ❌ Something is wrong with password hashing!');
        }

        // Show all users
        console.log('=== ALL USERS IN DATABASE ===');
        const allUsers = await User.find({}).select('name email role isActive');
        allUsers.forEach((u, i) => {
            console.log(`${i + 1}. ${u.email} (${u.role}) - Active: ${u.isActive}`);
        });
        console.log('==============================\n');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
};

testLogin();
