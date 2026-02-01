const Download = require('../models/Download');
const User = require('../models/User');
const Book = require('../models/Book');
const Order = require('../models/Order');
const path = require('path');
const fs = require('fs');

// @desc    Download purchased book
// @route   GET /api/downloads/:bookId
// @access  Private
exports.downloadBook = async (req, res, next) => {
    try {
        const { bookId } = req.params;

        console.log(`Download request for book ${bookId} by user ${req.user._id}`);

        // Find book
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Admin Bypass for debugging
        if (req.user.role === 'admin') {
            const filePath = path.resolve(book.bookFile);
            console.log(`Admin download: ${filePath}`);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    message: `File not found at: ${filePath}`
                });
            }

            // Get actual file size
            const stat = fs.statSync(filePath);
            const fileSize = stat.size;

            // Serve file directly
            const fileName = `${book.title.replace(/[^a-z0-9]/gi, '_')}.${book.fileFormat}`;
            res.setHeader('Content-Type', book.fileFormat === 'pdf' ? 'application/pdf' : 'application/epub+zip');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Length', fileSize);
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
            return;
        }

        // Check if user has purchased the book with populated orders
        const user = await User.findById(req.user._id).populate({
            path: 'purchasedBooks.orderId',
            select: 'paymentStatus'
        });

        if (!user.hasPurchased(bookId)) {
            return res.status(403).json({
                success: false,
                message: 'You have not purchased this book. Please purchase to download.'
            });
        }

        // Find the SUCCESSFUL purchase info
        let purchaseInfo = user.purchasedBooks.find(
            item => item.book &&
                item.book.toString() === bookId &&
                item.orderId &&
                item.orderId.paymentStatus === 'completed'
        );

        if (!purchaseInfo) {
            // Fallback to check if ANY record exists, to give better error
            const anyPurchase = user.purchasedBooks.find(
                item => item.book && item.book.toString() === bookId
            );

            if (anyPurchase) {
                return res.status(403).json({
                    success: false,
                    message: 'Payment verification failed or pending. Cannot download.'
                });
            }

            return res.status(403).json({
                success: false,
                message: 'Purchase information not found'
            });
        }

        // If we found a valid purchaseInfo, the order is by definition completed due to the filter above
        // Proceed to download

        // Check if file exists
        const filePath = path.resolve(book.bookFile);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'Book file not found on server'
            });
        }

        // Get actual file size
        const stat = fs.statSync(filePath);
        const fileSize = stat.size;

        // Log download
        let downloadRecord = await Download.findOne({ user: req.user._id, book: bookId });

        if (downloadRecord) {
            downloadRecord.downloadCount += 1;
            downloadRecord.downloadDate = new Date();
            downloadRecord.ipAddress = req.ip || req.connection.remoteAddress;
            downloadRecord.userAgent = req.get('user-agent');
            await downloadRecord.save();
        } else {
            await Download.create({
                user: req.user._id,
                book: bookId,
                order: purchaseInfo ? purchaseInfo.orderId : null, // handle null if admin bypass
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.get('user-agent')
            });
        }

        // Set headers for download
        const fileName = `${book.title.replace(/[^a-z0-9]/gi, '_')}.${book.fileFormat}`;

        res.setHeader('Content-Type', book.fileFormat === 'pdf' ? 'application/pdf' : 'application/epub+zip');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Length', fileSize); // Use actual file size

        // Stream file to response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on('error', (error) => {
            console.error('File stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: 'Error downloading file'
                });
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get user's purchased books (library)
// @route   GET /api/downloads/library
// @access  Private
exports.getUserLibrary = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'purchasedBooks.book',
                select: 'title author coverImage description price fileFormat fileSize category'
            })
            .populate({
                path: 'purchasedBooks.orderId',
                select: 'paymentStatus'
            });

        // Filter out deleted books AND ensures payment is completed
        const validLibrary = user.purchasedBooks.filter(item => {
            return item.book != null &&
                item.orderId &&
                item.orderId.paymentStatus === 'completed';
        });

        res.status(200).json({
            success: true,
            count: validLibrary.length,
            library: validLibrary
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get download history
// @route   GET /api/downloads/history
// @access  Private
exports.getDownloadHistory = async (req, res, next) => {
    try {
        const downloads = await Download.find({ user: req.user._id })
            .populate('book', 'title author coverImage fileFormat')
            .populate('order', 'paymentStatus')
            .sort({ downloadDate: -1 });

        const validDownloads = downloads.filter(item =>
            item.book != null &&
            item.order &&
            item.order.paymentStatus === 'completed'
        );

        res.status(200).json({
            success: true,
            count: validDownloads.length,
            downloads: validDownloads
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Check if user can download a book
// @route   GET /api/downloads/check/:bookId
// @access  Private
exports.checkDownloadAccess = async (req, res, next) => {
    try {
        const { bookId } = req.params;

        const user = await User.findById(req.user._id);
        const hasPurchased = user.hasPurchased(bookId);

        if (hasPurchased) {
            const purchaseInfo = user.purchasedBooks.find(
                item => item.book.toString() === bookId
            );

            const order = await Order.findById(purchaseInfo.orderId);

            res.status(200).json({
                success: true,
                canDownload: order.paymentStatus === 'completed',
                purchaseDate: purchaseInfo.purchaseDate,
                orderStatus: order.orderStatus,
                paymentStatus: order.paymentStatus
            });
        } else {
            res.status(200).json({
                success: true,
                canDownload: false,
                message: 'Book not purchased'
            });
        }
    } catch (error) {
        next(error);
    }
};
