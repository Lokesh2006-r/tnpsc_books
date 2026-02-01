const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const setupDatabase = async () => {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║         DATABASE CONFIGURATION SETUP                  ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');

    console.log('Choose your database option:\n');
    console.log('1. MongoDB Atlas (Cloud - Free)');
    console.log('2. Local MongoDB (Different database name)');
    console.log('3. Remote MongoDB Server');
    console.log('4. Keep current configuration\n');

    const choice = await question('Enter your choice (1-4): ');

    let mongoUri = '';

    switch (choice.trim()) {
        case '1':
            console.log('\n📋 MongoDB Atlas Setup:\n');
            console.log('1. Go to: https://www.mongodb.com/cloud/atlas/register');
            console.log('2. Create a free cluster');
            console.log('3. Click "Connect" → "Connect your application"');
            console.log('4. Copy the connection string\n');

            mongoUri = await question('Paste your MongoDB Atlas connection string: ');

            if (!mongoUri.includes('mongodb+srv://')) {
                console.log('\n⚠️  Warning: This doesn\'t look like a MongoDB Atlas connection string');
                const confirm = await question('Continue anyway? (y/n): ');
                if (confirm.toLowerCase() !== 'y') {
                    console.log('Setup cancelled.');
                    rl.close();
                    return;
                }
            }
            break;

        case '2':
            const dbName = await question('\nEnter your database name (e.g., mybookstore): ');
            mongoUri = `mongodb://localhost:27017/${dbName}`;
            console.log(`\n✅ Will use: ${mongoUri}`);
            break;

        case '3':
            console.log('\n📋 Remote MongoDB Setup:\n');
            const host = await question('Enter server IP/hostname: ');
            const port = await question('Enter port (default 27017): ') || '27017';
            const database = await question('Enter database name: ');
            const needsAuth = await question('Requires authentication? (y/n): ');

            if (needsAuth.toLowerCase() === 'y') {
                const username = await question('Username: ');
                const password = await question('Password: ');
                mongoUri = `mongodb://${username}:${password}@${host}:${port}/${database}`;
            } else {
                mongoUri = `mongodb://${host}:${port}/${database}`;
            }
            console.log(`\n✅ Will use: ${mongoUri.replace(/:[^:@]+@/, ':****@')}`);
            break;

        case '4':
            console.log('\n✅ Keeping current configuration');
            rl.close();
            return;

        default:
            console.log('\n❌ Invalid choice');
            rl.close();
            return;
    }

    // Update .env file
    const envPath = path.join(__dirname, '.env');
    let envContent = '';

    try {
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');

            // Replace MONGODB_URI
            if (envContent.includes('MONGODB_URI=')) {
                envContent = envContent.replace(
                    /MONGODB_URI=.*/,
                    `MONGODB_URI=${mongoUri}`
                );
            } else {
                envContent += `\nMONGODB_URI=${mongoUri}\n`;
            }
        } else {
            // Create new .env file
            const examplePath = path.join(__dirname, '.env.example');
            if (fs.existsSync(examplePath)) {
                envContent = fs.readFileSync(examplePath, 'utf8');
                envContent = envContent.replace(
                    /MONGODB_URI=.*/,
                    `MONGODB_URI=${mongoUri}`
                );
            } else {
                envContent = `MONGODB_URI=${mongoUri}\n`;
            }
        }

        fs.writeFileSync(envPath, envContent);
        console.log('\n✅ .env file updated successfully!\n');

    } catch (error) {
        console.error('\n❌ Error updating .env file:', error.message);
        rl.close();
        return;
    }

    // Test connection
    console.log('🔍 Testing database connection...\n');

    try {
        const mongoose = require('mongoose');
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });

        console.log('✅ Database connection successful!\n');

        // Show database info
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        console.log('📊 Database Information:');
        console.log('   Name:', db.databaseName);
        console.log('   Collections:', collections.length);
        if (collections.length > 0) {
            console.log('   Existing collections:', collections.map(c => c.name).join(', '));
        }
        console.log('');

        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('\n💡 Tips:');
        console.log('   - Check your connection string');
        console.log('   - Make sure MongoDB is running');
        console.log('   - Check firewall settings');
        console.log('   - Verify username/password\n');
        rl.close();
        return;
    }

    // Ask about creating admin user
    const createAdmin = await question('Create admin user in this database? (y/n): ');

    if (createAdmin.toLowerCase() === 'y') {
        console.log('\n📝 Creating admin user...');

        try {
            const mongoose = require('mongoose');
            await mongoose.connect(mongoUri);

            const User = require('./models/User');

            const existingAdmin = await User.findOne({ email: 'admin@bookstore.com' });

            if (existingAdmin) {
                console.log('✅ Admin user already exists');
                console.log('   Email: admin@bookstore.com');
                console.log('   Password: admin123');
            } else {
                await User.create({
                    name: 'Admin',
                    email: 'admin@bookstore.com',
                    password: 'admin123',
                    role: 'admin',
                    isActive: true
                });
                console.log('✅ Admin user created!');
                console.log('   Email: admin@bookstore.com');
                console.log('   Password: admin123');
            }

            await mongoose.connection.close();

        } catch (error) {
            console.error('❌ Error creating admin user:', error.message);
        }
    }

    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║              SETUP COMPLETE!                          ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    console.log('Next steps:');
    console.log('1. Restart your backend server (Ctrl+C then npm run dev)');
    console.log('2. Your app will now use the new database');
    console.log('3. Login with: admin@bookstore.com / admin123\n');

    rl.close();
};

setupDatabase().catch(error => {
    console.error('Setup error:', error);
    process.exit(1);
});
