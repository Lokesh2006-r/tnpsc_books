const Book = require('../models/Book');
const { body } = require('express-validator');
const fs = require('fs').promises;
const path = require('path');

// @desc    Get all books with pagination and filters
// @route   GET /api/books
// @access  Public
exports.getAllBooks = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Build query
        let query = { isAvailable: true };

        // Category filter
        if (req.query.category && req.query.category !== 'All') {
            query.category = req.query.category;
        }

        // Search filter
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        }

        // Price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
        }

        // Execute query
        const books = await Book.find(query)
            .select('-bookFile')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Book.countDocuments(query);

        res.status(200).json({
            success: true,
            count: books.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            books
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
exports.getBookById = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id).select('-bookFile');

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        res.status(200).json({
            success: true,
            book
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new book (Admin only)
// @route   POST /api/books
// @access  Private/Admin
exports.createBook = async (req, res, next) => {
    try {
        const bookData = {
            ...req.body,
            coverImage: req.files?.coverImage?.[0]?.path || '',
            bookFile: req.files?.bookFile?.[0]?.path || '',
            fileFormat: req.files?.bookFile?.[0]?.originalname.split('.').pop().toLowerCase(),
            fileSize: req.files?.bookFile?.[0]?.size || 0
        };

        const book = await Book.create(bookData);

        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            book
        });
    } catch (error) {
        // Clean up uploaded files if book creation fails
        if (req.files?.coverImage?.[0]?.path) {
            await fs.unlink(req.files.coverImage[0].path).catch(() => { });
        }
        if (req.files?.bookFile?.[0]?.path) {
            await fs.unlink(req.files.bookFile[0].path).catch(() => { });
        }
        next(error);
    }
};

// @desc    Update book (Admin only)
// @route   PUT /api/books/:id
// @access  Private/Admin
exports.updateBook = async (req, res, next) => {
    try {
        let book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        const updateData = { ...req.body };

        // Handle file updates
        if (req.files?.coverImage?.[0]) {
            // Delete old cover image
            if (book.coverImage) {
                await fs.unlink(book.coverImage).catch(() => { });
            }
            updateData.coverImage = req.files.coverImage[0].path;
        }

        if (req.files?.bookFile?.[0]) {
            // Delete old book file
            if (book.bookFile) {
                await fs.unlink(book.bookFile).catch(() => { });
            }
            updateData.bookFile = req.files.bookFile[0].path;
            updateData.fileFormat = req.files.bookFile[0].originalname.split('.').pop().toLowerCase();
            updateData.fileSize = req.files.bookFile[0].size;
        }

        book = await Book.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Book updated successfully',
            book
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete book (Admin only)
// @route   DELETE /api/books/:id
// @access  Private/Admin
exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Delete associated files
        if (book.coverImage) {
            await fs.unlink(book.coverImage).catch(() => { });
        }
        if (book.bookFile) {
            await fs.unlink(book.bookFile).catch(() => { });
        }

        await book.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle book availability (Admin only)
// @route   PATCH /api/books/:id/availability
// @access  Private/Admin
exports.toggleAvailability = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        book.isAvailable = !book.isAvailable;
        await book.save();

        res.status(200).json({
            success: true,
            message: `Book ${book.isAvailable ? 'enabled' : 'disabled'} successfully`,
            book
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get featured books
// @route   GET /api/books/featured
// @access  Public
exports.getFeaturedBooks = async (req, res, next) => {
    try {
        const books = await Book.find({ isAvailable: true })
            .select('-bookFile')
            .sort({ totalSales: -1, rating: -1 })
            .limit(8);

        res.status(200).json({
            success: true,
            count: books.length,
            books
        });
    } catch (error) {
        next(error);
    }
};

// Validation rules
exports.createBookValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('author').trim().notEmpty().withMessage('Author is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('shortDescription').trim().notEmpty().withMessage('Short description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required')
];
