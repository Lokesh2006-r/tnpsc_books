const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const paymentSchema = new mongoose.Schema({
    referenceId: {
        type: String,
        unique: true,
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        enum: ['upi', 'card', 'netbanking', 'wallet'],
        default: 'upi'
    },
    upiTransactionId: {
        type: String
    },
    upiId: {
        type: String
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'failed'],
        default: 'pending'
    },
    verificationAttempts: {
        type: Number,
        default: 0
    },
    maxVerificationAttempts: {
        type: Number,
        default: 3
    },
    verifiedAt: {
        type: Date
    },
    failureReason: {
        type: String
    },
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

// Generate unique reference ID before validation
paymentSchema.pre('validate', function (next) {
    if (!this.referenceId) {
        this.referenceId = `PAY-${uuidv4().split('-')[0].toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    }
    next();
});

// Index for faster queries
paymentSchema.index({ referenceId: 1 });
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
