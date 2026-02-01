require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Book = require('./models/Book');

// Artifact paths
const sourceImages = [
    'C:/Users/91807/.gemini/antigravity/brain/4662b51f-b47d-40ad-be3b-9828440d08bb/tnpsc_gs_guide_1769155321264.png',
    'C:/Users/91807/.gemini/antigravity/brain/4662b51f-b47d-40ad-be3b-9828440d08bb/tamil_grammar_masterclass_1769155338735.png',
    'C:/Users/91807/.gemini/antigravity/brain/4662b51f-b47d-40ad-be3b-9828440d08bb/modern_indian_history_1769155356477.png',
    'C:/Users/91807/.gemini/antigravity/brain/4662b51f-b47d-40ad-be3b-9828440d08bb/quantitative_aptitude_tnpsc_1769155434554.png'
];


const booksData = [
    {
        title: 'TNPSC General Studies Guide',
        author: 'Dr. A. Ramachandran',
        description: 'Comprehensive guide for TNPSC Group 1, 2, and 4 exams covering History, Geography, Polity, Economy, and Science.',
        shortDescription: 'Complete General Studies guide for all TNPSC exams.',
        price: 499,
        category: 'Non-Fiction',
        coverImage: 'uploads/covers/tnpsc_gs.png',
        bookFile: 'uploads/books/tnpsc_gs.pdf',
        fileFormat: 'pdf',
        fileSize: 15400000,
        pages: 450,
        language: 'English',
        isAvailable: true,
        rating: 4.8,
        reviews: 124
    },
    {
        title: 'Tamil Grammar Masterclass',
        author: 'Pulavar Senthamizhan',
        description: 'Master Tamil Ilakkanam with easy-to-understand explanations and examples. Essential for Group 4 Podhu Tamil.',
        shortDescription: 'Expert guide to Tamil Grammar for competitive exams.',
        price: 350,
        category: 'Non-Fiction',
        coverImage: 'uploads/covers/tamil_grammar.png',
        bookFile: 'uploads/books/tamil_grammar.pdf',
        fileFormat: 'pdf',
        fileSize: 8500000,
        pages: 280,
        language: 'none',
        isAvailable: true,
        rating: 4.9,
        reviews: 89
    },
    {
        title: 'Modern Indian History',
        author: 'Bipin Chandra',
        description: 'Detailed account of India\'s struggle for independence. Covers the revolt of 1857 to 1947 partition.',
        shortDescription: 'History of Modern India from 1857 to 1947.',
        price: 425,
        category: 'History',
        coverImage: 'uploads/covers/indian_history.png',
        bookFile: 'uploads/books/indian_history.pdf',
        fileFormat: 'pdf',
        fileSize: 12200000,
        pages: 350,
        language: 'English',
        isAvailable: true,
        rating: 4.7,
        reviews: 210
    },
    {
        title: 'Quantitative Aptitude for TNPSC',
        author: 'R.S. Aggarwal (Adapted)',
        description: 'Solved aptitude and mental ability questions specifically curated for TNPSC exam patterns.',
        shortDescription: 'Maths and Mental Ability for TNPSC.',
        price: 550,
        category: 'Science',
        coverImage: 'uploads/covers/aptitude.png',
        bookFile: 'uploads/books/aptitude.pdf',
        fileFormat: 'pdf',
        fileSize: 18100000,
        pages: 520,
        language: 'English',
        isAvailable: true,
        rating: 4.6,
        reviews: 156
    },
    {
        title: 'Indian Polity & Constitution',
        author: 'M. Laxmikanth',
        description: 'The bible of Indian Polity. Must-read for Group 1 and 2 aspirants. Features latest amendments.',
        shortDescription: 'Complete guide to Indian Constitution and Polity.',
        price: 650,
        category: 'Non-Fiction',
        coverImage: 'uploads/covers/polity.png',
        bookFile: 'uploads/books/polity.pdf',
        fileFormat: 'pdf',
        fileSize: 22500000,
        pages: 600,
        language: 'English',
        isAvailable: true,
        rating: 4.9,
        reviews: 340
    }
];


const seedBooks = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Setup directories
        const uploadsDir = path.join(__dirname, 'uploads');
        const coversDir = path.join(uploadsDir, 'covers');
        const booksDir = path.join(uploadsDir, 'books');

        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
        if (!fs.existsSync(coversDir)) fs.mkdirSync(coversDir);
        if (!fs.existsSync(booksDir)) fs.mkdirSync(booksDir);

        console.log('Directories checked/created');

        // Copy Images
        const targetImages = [
            'tnpsc_gs.png',
            'tamil_grammar.png',
            'indian_history.png',
            'aptitude.png',
            'polity.png'
        ];

        const sourceMap = [0, 1, 2, 3, 0];

        targetImages.forEach((target, index) => {
            const sourceIndex = sourceMap[index];
            try {
                if (sourceImages[sourceIndex] && fs.existsSync(sourceImages[sourceIndex])) {
                    if (!fs.existsSync(path.join(coversDir, target))) {
                        fs.copyFileSync(sourceImages[sourceIndex], path.join(coversDir, target));
                        console.log(`Copied cover: ${target}`);
                    }
                } else {
                    console.log(`Source image not found for ${target}, creating dummy placeholder`);
                    // Create dummy image file to avoid broken links
                    fs.writeFileSync(path.join(coversDir, target), 'Dummy image content');
                }
            } catch (e) {
                console.log(`Failed to copy image ${target}: ${e.message}`);
                // Create dummy as fallback
                try {
                    fs.writeFileSync(path.join(coversDir, target), 'Dummy image content');
                } catch (e2) { }
            }
        });

        // Create Dummy PDFs
        const targetPDFs = booksData.map(b => b.bookFile);
        targetPDFs.forEach(pdf => {
            const pdfPath = path.join(__dirname, pdf);
            if (!fs.existsSync(pdfPath)) {
                fs.writeFileSync(pdfPath, 'This is a dummy PDF file content.');
                console.log(`Created dummy PDF: ${pdf}`);
            }
        });

        // Insert Books
        // First delete existing books with same titles to clear old failed attempts or duplicates
        for (const book of booksData) {
            await Book.deleteOne({ title: book.title });
        }

        const books = await Book.insertMany(booksData);
        console.log(`Successfully added ${books.length} books to the database!`);

        mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('Error seeding books:', error.message);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`Validation error on ${key}: ${error.errors[key].message}`);
            });
        }
        process.exit(1);
    }
};

seedBooks();
