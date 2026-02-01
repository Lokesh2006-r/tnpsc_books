const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a book title'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    author: {
        type: String,
        required: [true, 'Please provide author name'],
        trim: true,
        maxlength: [100, 'Author name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    shortDescription: {
        type: String,
        required: [true, 'Please provide a short description'],
        maxlength: [300, 'Short description cannot exceed 300 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: [0, 'Price cannot be negative']
    },
    coverImage: {
        type: String,
        required: [true, 'Please provide a cover image']
    },
    bookFile: {
        type: String,
        required: [true, 'Please provide a book file']
    },
    fileFormat: {
        type: String,
        enum: ['pdf', 'epub'],
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'Business', 'Self-Help', 'Biography', 'History', 'Other']
    },
    language: {
        type: String,
        default: 'English'
    },
    pages: {
        type: Number,
        min: [1, 'Pages must be at least 1']
    },
    isbn: {
        type: String,
        unique: true,
        sparse: true
    },
    publishedDate: {
        type: Date
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    totalSales: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for search functionality
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

// Method to increment sales
bookSchema.methods.incrementSales = async function () {
    this.totalSales += 1;
    await this.save();
};

module.exports = mongoose.model('Book', bookSchema);
