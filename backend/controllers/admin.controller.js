const User = require('../models/User');
const Book = require('../models/Book');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Download = require('../models/Download');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
    try {
        // Get counts
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalBooks = await Book.countDocuments();
        const totalOrders = await Order.countDocuments();
        const completedOrders = await Order.countDocuments({ orderStatus: 'completed' });

        // Calculate total revenue
        const revenueData = await Order.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        // Get recent orders
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .populate('books.book', 'title')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get top selling books
        const topBooks = await Book.find({ isAvailable: true })
            .sort({ totalSales: -1 })
            .limit(5)
            .select('title author totalSales price coverImage');

        // Monthly revenue (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    paymentStatus: 'completed',
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalBooks,
                totalOrders,
                completedOrders,
                totalRevenue,
                recentOrders,
                topBooks,
                monthlyRevenue
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const users = await User.find({ role: 'user' })
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments({ role: 'user' });

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            users
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user details with orders
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserDetails = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('purchasedBooks.book', 'title author coverImage');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const orders = await Order.find({ user: req.params.id })
            .populate('books.book', 'title author')
            .sort({ createdAt: -1 });

        const downloads = await Download.find({ user: req.params.id })
            .populate('book', 'title')
            .sort({ downloadDate: -1 });

        res.status(200).json({
            success: true,
            user,
            orders,
            downloads
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle user active status
// @route   PATCH /api/admin/users/:id/toggle-status
// @access  Private/Admin
exports.toggleUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role === 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Cannot modify admin user'
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isActive: user.isActive
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        let query = {};
        if (req.query.status) {
            query.orderStatus = req.query.status;
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .populate('books.book', 'title author')
            .populate('paymentId')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all payments/transactions
// @route   GET /api/admin/transactions
// @access  Private/Admin
exports.getAllTransactions = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const payments = await Payment.find()
            .populate('user', 'name email')
            .populate('order', 'orderNumber totalAmount')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Payment.countDocuments();

        res.status(200).json({
            success: true,
            count: payments.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            transactions: payments
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get sales analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getSalesAnalytics = async (req, res, next) => {
    try {
        // Sales by category
        const salesByCategory = await Order.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $unwind: '$books' },
            {
                $lookup: {
                    from: 'books',
                    localField: 'books.book',
                    foreignField: '_id',
                    as: 'bookDetails'
                }
            },
            { $unwind: '$bookDetails' },
            {
                $group: {
                    _id: '$bookDetails.category',
                    totalSales: { $sum: 1 },
                    revenue: { $sum: '$books.price' }
                }
            },
            { $sort: { revenue: -1 } }
        ]);

        // Daily sales (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailySales = await Order.aggregate([
            {
                $match: {
                    paymentStatus: 'completed',
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    orders: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        res.status(200).json({
            success: true,
            analytics: {
                salesByCategory,
                dailySales
            }
        });
    } catch (error) {
        next(error);
    }
};
