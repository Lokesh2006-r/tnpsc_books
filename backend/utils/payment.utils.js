const { v4: uuidv4 } = require('uuid');

// Generate unique payment reference ID
exports.generatePaymentReferenceId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const uuid = uuidv4().split('-')[0].toUpperCase();
    return `PAY-${timestamp}-${uuid}`;
};

// Generate UPI transaction ID
exports.generateTransactionId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `UPI${timestamp}${random}`;
};

// Simulate UPI payment verification
// In production, replace this with actual payment gateway API call
// Verify UPI payment (Simulation with formatting check)
// Returns pending_verification status to require Admin approval
exports.verifyUPIPayment = async (paymentReferenceId, transactionId) => {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Strict Validation: Transaction ID must be exactly 12 digits
            const upiTransactionRegex = /^\d{12}$/;

            if (!transactionId) {
                resolve({
                    success: false,
                    verified: false,
                    status: 'failed',
                    message: 'Transaction ID is required',
                    failureReason: 'Missing Transaction ID'
                });
                return;
            }

            if (upiTransactionRegex.test(transactionId)) {
                // Valid Format -> Mark as Pending Verification (Admin must approve)
                resolve({
                    success: true, // Request accepted
                    verified: false, // Not yet verified by money
                    transactionId: transactionId,
                    status: 'pending_verification',
                    message: 'Transaction submitted for manual verification',
                    verifiedAt: null
                });
            } else {
                // Invalid Format
                resolve({
                    success: false,
                    verified: false,
                    status: 'failed',
                    message: 'Invalid Transaction ID format. Must be 12 digits.',
                    failureReason: 'Invalid Transaction ID Format'
                });
            }
        }, 1500);
    });
};

// Initiate UPI payment (simulation)
// In production, integrate with Razorpay, PayU, or other payment gateway
exports.initiateUPIPayment = async (amount, orderId, userEmail) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const paymentReferenceId = exports.generatePaymentReferenceId();

            resolve({
                success: true,
                paymentReferenceId,
                amount,
                orderId,
                upiLink: `upi://pay?pa=merchant@upi&pn=BookStore&am=${amount}&tr=${paymentReferenceId}&tn=Order${orderId}`,
                qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=merchant@upi&pn=BookStore&am=${amount}&tr=${paymentReferenceId}`,
                expiresIn: 15 * 60 * 1000 // 15 minutes
            });
        }, 1000);
    });
};

// Calculate order total with validation
exports.calculateOrderTotal = (books) => {
    if (!Array.isArray(books) || books.length === 0) {
        throw new Error('Invalid books array');
    }

    return books.reduce((total, book) => {
        if (!book.price || book.price < 0) {
            throw new Error('Invalid book price');
        }
        return total + book.price;
    }, 0);
};

// Format currency
exports.formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
};
