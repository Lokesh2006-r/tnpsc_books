require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../models/Book');
const connectDB = require('../config/db.config');
const fs = require('fs');
const path = require('path');

// Create dummy files for demo books
const createDummyFiles = () => {
    const uploadsDir = path.join(__dirname, '../uploads');
    const coversDir = path.join(uploadsDir, 'covers');
    const booksDir = path.join(uploadsDir, 'books');

    // Create directories if they don't exist
    [uploadsDir, coversDir, booksDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    // Create dummy files
    const dummyCover = 'uploads/covers/demo-cover.jpg';
    const dummyBook = 'uploads/books/demo-book.pdf';

    if (!fs.existsSync(dummyCover)) {
        fs.writeFileSync(dummyCover, 'Dummy cover image');
    }
    if (!fs.existsSync(dummyBook)) {
        fs.writeFileSync(dummyBook, 'Dummy book file');
    }

    return { dummyCover, dummyBook };
};

const demoBooks = [
    {
        title: 'The Art of Programming',
        author: 'John Smith',
        description: 'A comprehensive guide to mastering programming concepts and best practices. This book covers fundamental algorithms, data structures, design patterns, and modern software development methodologies. Perfect for both beginners and experienced developers looking to enhance their skills.',
        shortDescription: 'Master programming concepts and best practices with this comprehensive guide.',
        price: 599,
        category: 'Technology',
        language: 'English',
        pages: 450,
        isbn: '978-1234567890',
        publishedDate: new Date('2023-01-15'),
        fileFormat: 'pdf',
        fileSize: 5242880,
        isAvailable: true
    },
    {
        title: 'Modern Web Development',
        author: 'Sarah Johnson',
        description: 'Learn to build modern, responsive web applications using the latest technologies and frameworks. This book covers HTML5, CSS3, JavaScript ES6+, React, Node.js, and MongoDB. Includes hands-on projects and real-world examples to solidify your understanding.',
        shortDescription: 'Build modern web applications with the latest technologies and frameworks.',
        price: 799,
        category: 'Technology',
        language: 'English',
        pages: 520,
        isbn: '978-1234567891',
        publishedDate: new Date('2023-03-20'),
        fileFormat: 'pdf',
        fileSize: 6291456,
        isAvailable: true
    },
    {
        title: 'The Science of Success',
        author: 'Michael Chen',
        description: 'Discover the scientific principles behind achieving success in business and life. This book combines psychology, neuroscience, and behavioral economics to provide actionable strategies for goal achievement, habit formation, and personal growth. Based on extensive research and real-world case studies.',
        shortDescription: 'Scientific principles for achieving success in business and life.',
        price: 499,
        category: 'Self-Help',
        language: 'English',
        pages: 320,
        isbn: '978-1234567892',
        publishedDate: new Date('2023-05-10'),
        fileFormat: 'pdf',
        fileSize: 4194304,
        isAvailable: true
    },
    {
        title: 'Digital Marketing Mastery',
        author: 'Emily Rodriguez',
        description: 'A complete guide to digital marketing in the modern age. Learn SEO, social media marketing, content marketing, email campaigns, analytics, and conversion optimization. Includes case studies from successful campaigns and step-by-step strategies you can implement immediately.',
        shortDescription: 'Complete guide to mastering digital marketing strategies and tactics.',
        price: 699,
        category: 'Business',
        language: 'English',
        pages: 380,
        isbn: '978-1234567893',
        publishedDate: new Date('2023-07-25'),
        fileFormat: 'pdf',
        fileSize: 5767168,
        isAvailable: true
    },
    {
        title: 'The Future of AI',
        author: 'Dr. David Kumar',
        description: 'Explore the cutting-edge developments in artificial intelligence and machine learning. This book examines current AI technologies, their applications across industries, ethical considerations, and predictions for the future. Written by a leading AI researcher with contributions from industry experts.',
        shortDescription: 'Explore cutting-edge AI developments and their impact on our future.',
        price: 899,
        category: 'Science',
        language: 'English',
        pages: 420,
        isbn: '978-1234567894',
        publishedDate: new Date('2023-09-15'),
        fileFormat: 'pdf',
        fileSize: 7340032,
        isAvailable: true
    }
];

const seedBooks = async () => {
    try {
        await connectDB();

        // Create dummy files
        const { dummyCover, dummyBook } = createDummyFiles();

        // Check if books already exist
        const existingBooks = await Book.countDocuments();
        if (existingBooks > 0) {
            console.log(`⚠️  Database already has ${existingBooks} books`);
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });

            readline.question('Do you want to add demo books anyway? (yes/no): ', async (answer) => {
                readline.close();
                if (answer.toLowerCase() !== 'yes') {
                    console.log('❌ Cancelled');
                    process.exit(0);
                }
                await addBooks(dummyCover, dummyBook);
            });
        } else {
            await addBooks(dummyCover, dummyBook);
        }
    } catch (error) {
        console.error('❌ Error seeding books:', error.message);
        process.exit(1);
    }
};

const addBooks = async (dummyCover, dummyBook) => {
    try {
        // Generate unique ISBNs by adding timestamp
        const timestamp = Date.now().toString().slice(-5);

        // Add file paths to books with unique ISBNs
        const booksWithFiles = demoBooks.map((book, index) => ({
            ...book,
            isbn: `978-${timestamp}${index}${Math.floor(Math.random() * 1000)}`,
            coverImage: dummyCover,
            bookFile: dummyBook
        }));

        // Insert books
        const createdBooks = await Book.insertMany(booksWithFiles);

        console.log(`✅ Successfully added ${createdBooks.length} demo books:`);
        createdBooks.forEach((book, index) => {
            console.log(`   ${index + 1}. ${book.title} by ${book.author} - ₹${book.price}`);
        });

        console.log('\n📝 Note: Demo books use placeholder images and files.');
        console.log('   To add real books, use the admin panel to upload actual cover images and book files.\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding books:', error.message);
        process.exit(1);
    }
};

seedBooks();
