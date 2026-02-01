const Order = require('../models/Order');
const Book = require('../models/Book');
const User = require('../models/User');
const { body } = require('express-validator');
const { calculateOrderTotal } = require('../utils/payment.utils');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        const { books } = req.body; // Array of book IDs

        if (!books || !Array.isArray(books) || books.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide at least one book'
            });
        }

        // Fetch book details
        const bookDetails = await Book.find({ _id: { $in: books }, isAvailable: true });

        if (bookDetails.length !== books.length) {
            return res.status(400).json({
                success: false,
                message: 'Some books are not available or do not exist'
            });
        }

        // Check if user already purchased any of these books
        const user = await User.findById(req.user._id);
        const alreadyPurchased = bookDetails.filter(book =>
            user.hasPurchased(book._id)
        );

        if (alreadyPurchased.length > 0) {
            return res.status(400).json({
                success: false,
                message: `You have already purchased: ${alreadyPurchased.map(b => b.title).join(', ')}`
            });
        }

        // Prepare order books
        const orderBooks = bookDetails.map(book => ({
            book: book._id,
            title: book.title,
            author: book.author,
            price: book.price
        }));

        // Calculate total
        const totalAmount = calculateOrderTotal(bookDetails);

        // Create order
        const order = await Order.create({
            user: req.user._id,
            books: orderBooks,
            totalAmount,
            userEmail: req.user.email,
            userName: req.user.name
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'User authentication failed'
            });
        }

        const orders = await Order.find({ user: req.user._id })
            .populate('books.book', 'title author coverImage')
            .populate('paymentId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Error in getUserOrders:', error);
        next(error);
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('books.book', 'title author coverImage')
            .populate('paymentId');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if order belongs to user (unless admin)
        // Safe comparison using String conversion
        const orderUserId = order.user ? order.user.toString() : null;
        const requestUserId = req.user._id ? req.user._id.toString() : null;

        if (orderUserId !== requestUserId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this order'
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Error in getOrderById:', error);
        next(error);
    }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { orderStatus } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated',
            order
        });
    } catch (error) {
        next(error);
    }
};

// Validation rules
exports.createOrderValidation = [
    body('books').isArray({ min: 1 }).withMessage('Please provide at least one book')
];
