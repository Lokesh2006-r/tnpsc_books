const Payment = require('../models/Payment');
const Order = require('../models/Order');
const User = require('../models/User');
const Book = require('../models/Book');
const { initiateUPIPayment, verifyUPIPayment } = require('../utils/payment.utils');

// @desc    Initiate payment
// @route   POST /api/payments/initiate
// @access  Private
exports.initiatePayment = async (req, res, next) => {
    try {
        console.log('=== Payment Initiation Started ===');
        console.log('Request body:', req.body);
        console.log('User authenticated:', !!req.user);
        if (req.user) {
            console.log('User ID:', req.user._id);
        }

        const { orderId } = req.body;

        // Validate orderId
        if (!orderId) {
            console.error('No orderId provided');
            return res.status(400).json({
                success: false,
                message: 'Order ID is required'
            });
        }

        // Validate user authentication
        if (!req.user || !req.user._id) {
            console.error('User not authenticated properly');
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Find order
        console.log('Finding order with ID:', orderId);
        const order = await Order.findById(orderId);

        if (!order) {
            console.error('Order not found:', orderId);
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        console.log('Order found:', {
            id: order._id,
            user: order.user,
            totalAmount: order.totalAmount,
            orderStatus: order.orderStatus
        });

        // Check if order belongs to user
        const orderUserId = order.user.toString();
        const requestUserId = req.user._id.toString();

        console.log('Comparing user IDs:', { orderUserId, requestUserId });

        if (orderUserId !== requestUserId) {
            console.error('User not authorized for this order');
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this order'
            });
        }

        // Check if payment already exists for this order
        console.log('Checking for existing payment...');
        let payment = await Payment.findOne({ order: orderId });
        let isNewPayment = false;

        if (!payment) {
            // Create new payment
            console.log('Creating new payment...');
            try {
                payment = await Payment.create({
                    order: orderId,
                    user: req.user._id,
                    amount: order.totalAmount,
                    paymentMethod: 'upi'
                });
                isNewPayment = true;
                console.log('Payment created successfully:', payment.referenceId);
            } catch (error) {
                // If duplicate key error, fetch the existing payment
                if (error.code === 11000) {
                    console.log('Duplicate payment detected, fetching existing...');
                    payment = await Payment.findOne({ order: orderId });
                } else {
                    console.error('Error creating payment:', error);
                    throw error;
                }
            }
        } else {
            console.log('Existing payment found:', payment.referenceId);
        }

        // Return payment details with referenceId
        const response = {
            success: true,
            message: isNewPayment ? 'Payment initiated' : 'Payment already exists',
            payment: {
                referenceId: payment.referenceId,
                amount: payment.amount,
                paymentMethod: payment.paymentMethod,
                paymentStatus: payment.paymentStatus
            }
        };

        console.log('Sending response:', response);
        console.log('=== Payment Initiation Completed ===');

        res.status(200).json(response);
    } catch (error) {
        console.error('=== Payment Initiation Error ===');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        // Send a proper error response
        res.status(500).json({
            success: false,
            message: 'Error initiating payment',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// @desc    Verify payment (User submits transaction ID)
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
    try {
        const { paymentReferenceId, transactionId } = req.body;

        // Find payment
        const payment = await Payment.findOne({ referenceId: paymentReferenceId });
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Check if already completed
        if (payment.paymentStatus === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Payment already verified'
            });
        }

        // Check verification attempts
        if (payment.verificationAttempts >= payment.maxVerificationAttempts) {
            return res.status(400).json({
                success: false,
                message: 'Maximum verification attempts exceeded. Please contact support.'
            });
        }

        // Verify payment format
        const verificationResult = await verifyUPIPayment(payment.referenceId, transactionId);

        // Update verify attempts
        payment.verificationAttempts += 1;
        payment.upiTransactionId = transactionId;

        if (verificationResult.success) {
            // Check status
            if (verificationResult.status === 'pending_verification') {
                payment.verificationStatus = 'pending';
                payment.paymentStatus = 'processing'; // User has paid, waiting for admin
                payment.failureReason = null;

                await payment.save();

                // Update order status to processing
                const order = await Order.findById(payment.order);
                order.paymentStatus = 'processing';
                order.orderStatus = 'processing';
                order.paymentId = payment._id;
                await order.save();

                return res.status(200).json({
                    success: true,
                    message: 'Transaction ID submitted. Please wait for admin approval.',
                    payment,
                    requiresAdminApproval: true
                });
            }
        } else {
            // Failed validation
            payment.verificationStatus = 'failed';
            payment.paymentStatus = 'failed';
            payment.failureReason = verificationResult.message;
            await payment.save();

            return res.status(400).json({
                success: false,
                message: verificationResult.message || 'Payment verification failed'
            });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Admin Verify Payment (Manual Approval)
// @route   POST /api/payments/:id/approve
// @access  Private/Admin
exports.adminVerifyPayment = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        if (payment.paymentStatus === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Payment already completed'
            });
        }

        // Approve Payment
        payment.verificationStatus = 'verified';
        payment.paymentStatus = 'completed';
        payment.verifiedAt = new Date();
        await payment.save();

        // Update order
        const order = await Order.findById(payment.order);
        order.paymentStatus = 'completed';
        order.orderStatus = 'completed';
        await order.save();

        // Grant access to books
        const user = await User.findById(payment.user);

        // Ensure we don't duplicate books if already there (though rare)
        const newBooks = order.books.map(b => b.book);
        const existingBooks = user.purchasedBooks.map(b => b.book.toString());

        const booksToAdd = newBooks.filter(bookId => !existingBooks.includes(bookId.toString()));

        if (booksToAdd.length > 0) {
            // Add books
            const newBookRecords = booksToAdd.map(bookId => ({
                book: bookId,
                purchaseDate: new Date(),
                orderId: order._id
            }));

            // We can't push objects directly if schema expects subdocuments structure matching schema
            // Simpler: push objects with matching structure
            booksToAdd.forEach(bookId => {
                user.purchasedBooks.push({
                    book: bookId,
                    purchaseDate: new Date(),
                    orderId: order._id
                });
            });

            await user.save();

            // Update sales counts
            await Book.updateMany(
                { _id: { $in: booksToAdd } },
                { $inc: { totalSales: 1 } }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Payment approved and books unlocked',
            payment
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get payment status
// @route   GET /api/payments/:referenceId
// @access  Private
exports.getPaymentStatus = async (req, res, next) => {
    try {
        const payment = await Payment.findOne({ referenceId: req.params.referenceId })
            .populate('order')
            .populate('user', 'name email');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.status(200).json({
            success: true,
            payment
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res, next) => {
    try {
        const payments = await Payment.find({ user: req.user._id })
            .populate('order')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });
    } catch (error) {
        next(error);
    }
};
