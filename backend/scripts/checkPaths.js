const mongoose = require('mongoose');
require('dotenv').config();
const Book = require('../models/Book');
const connectDB = require('../config/db.config');

const checkBookPaths = async () => {
    try {
        await connectDB();
        const books = await Book.find({});
        console.log('--- Checking Book File Paths ---');
        books.forEach(book => {
            console.log(`Title: ${book.title}`);
            console.log(`ID: ${book._id}`);
            console.log(`File Path: ${book.bookFile}`);
            console.log('--------------------------------');
        });
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkBookPaths();
