const mongoose = require('mongoose');

const paymentSettingsSchema = new mongoose.Schema({
    upiId: {
        type: String,
        required: true,
        trim: true
    },
    merchantName: {
        type: String,
        required: true,
        default: 'BookStore'
    },
    qrCodeEnabled: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Only allow one settings document
paymentSettingsSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

module.exports = mongoose.model('PaymentSettings', paymentSettingsSchema);
