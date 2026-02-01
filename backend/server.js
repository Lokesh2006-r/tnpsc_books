require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db.config');
const { errorHandler, notFound } = require('./middleware/error.middleware');

// Initialize app
const app = express();

// CORS configuration - Allow all origins in development
// MOVED TO TOP to ensure headers are present even if other middleware blocks the request
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'https://tnpscbooks.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Connect to database
connectDB();

// Security middleware - Configure Helmet to allow images
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false
}));

// Rate limiting
// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000, // limit each IP to 5000 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Force restart timestamp: 2

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Serve static files (uploads) with CORS headers
app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static('uploads'));

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/books', require('./routes/book.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/payment-settings', require('./routes/paymentSettings.routes'));
app.use('/api/downloads', require('./routes/download.routes'));
app.use('/api/slides', require('./routes/slide.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Digital Book Store API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            books: '/api/books',
            orders: '/api/orders',
            payments: '/api/payments',
            downloads: '/api/downloads',
            admin: '/api/admin'
        }
    });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║     📚 Digital Book Store API Server                 ║
║                                                       ║
║     🚀 Server running on port ${PORT}                    ║
║     🌍 Environment: ${process.env.NODE_ENV || 'development'}                    ║
║     📡 API: http://localhost:${PORT}/api              ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});


module.exports = app;
