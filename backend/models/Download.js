const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    downloadDate: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    downloadCount: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

// Index for efficient queries
downloadSchema.index({ user: 1, book: 1 });
downloadSchema.index({ downloadDate: -1 });

module.exports = mongoose.model('Download', downloadSchema);
