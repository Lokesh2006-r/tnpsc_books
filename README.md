# 📚 Digital Book Store - Production-Ready E-Commerce Platform

A complete, full-stack digital book store web application with secure payment processing, user authentication, and admin management capabilities.

## ✨ Features

### User Features
- 🔐 **Secure Authentication** - JWT-based signup/login with password hashing
- 📖 **Browse Books** - Search, filter by category, and paginate through books
- 🛒 **Shopping Cart** - Add multiple books and manage cart
- 💳 **Secure Checkout** - UPI payment integration with verification
- 📥 **Digital Downloads** - Secure, authenticated book downloads (PDF/EPUB)
- 📚 **My Library** - Access all purchased books anytime
- 📊 **Order History** - Track all orders and transactions

### Admin Features
- 📊 **Dashboard** - Real-time statistics and analytics
- ➕ **Book Management** - Add, edit, delete books with file uploads
- 👥 **User Management** - View and manage registered users
- 📦 **Order Management** - View and update order statuses
- 💰 **Sales Analytics** - Track revenue and sales by category
- 🔒 **Protected Routes** - Role-based access control

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Express Validator** - Input validation

### Frontend
- **Next.js 14** - React framework with SSR
- **React 18** - UI library
- **Axios** - HTTP client
- **React Context** - State management
- **React Toastify** - Notifications
- **React Icons** - Icon library

## 📁 Project Structure

```
tnpsc website/
├── backend/
│   ├── config/
│   │   ├── db.config.js
│   │   └── upload.config.js
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   ├── book.controller.js
│   │   ├── download.controller.js
│   │   ├── order.controller.js
│   │   └── payment.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   ├── models/
│   │   ├── Book.js
│   │   ├── Download.js
│   │   ├── Order.js
│   │   ├── Payment.js
│   │   └── User.js
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   ├── book.routes.js
│   │   ├── download.routes.js
│   │   ├── order.routes.js
│   │   └── payment.routes.js
│   ├── scripts/
│   │   └── seedAdmin.js
│   ├── utils/
│   │   └── payment.utils.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── components/
    │   ├── AdminRoute.js
    │   ├── BookCard.js
    │   ├── Footer.js
    │   ├── Layout.js
    │   ├── Navbar.js
    │   └── ProtectedRoute.js
    ├── context/
    │   ├── AuthContext.js
    │   └── CartContext.js
    ├── pages/
    │   ├── admin/
    │   │   └── index.js
    │   ├── books/
    │   │   ├── [id].js
    │   │   └── index.js
    │   ├── dashboard/
    │   │   └── library.js
    │   ├── payment/
    │   │   └── [referenceId].js
    │   ├── _app.js
    │   ├── cart.js
    │   ├── checkout.js
    │   ├── index.js
    │   ├── login.js
    │   └── signup.js
    ├── styles/
    │   ├── globals.css
    │   └── [various module.css files]
    ├── utils/
    │   └── api.js
    ├── .env.local
    ├── next.config.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd "e:/tnpsc website"
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Configure Backend Environment**
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and update the following:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (generate a secure random string)
# - ADMIN_EMAIL and ADMIN_PASSWORD (admin credentials)
```

4. **Create Admin User**
```bash
npm run seed
```

5. **Start Backend Server**
```bash
npm run dev
# Server runs on http://localhost:5000
```

6. **Frontend Setup** (in a new terminal)
```bash
cd frontend
npm install
```

7. **Start Frontend**
```bash
npm run dev
# App runs on http://localhost:3000
```

## 🔑 Default Admin Credentials

```
Email: admin@bookstore.com
Password: Admin@123
```

**⚠️ IMPORTANT:** Change these credentials immediately after first login!

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Books
- `GET /api/books` - Get all books (with pagination, search, filters)
- `GET /api/books/featured` - Get featured books
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (Admin)
- `PUT /api/books/:id` - Update book (Admin)
- `DELETE /api/books/:id` - Delete book (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order

### Payments
- `POST /api/payments/initiate` - Initiate payment
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/:referenceId` - Get payment status

### Downloads
- `GET /api/downloads/library` - Get user's library
- `GET /api/downloads/history` - Get download history
- `GET /api/downloads/:bookId` - Download book file
- `GET /api/downloads/check/:bookId` - Check download access

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/admin/analytics` - Get sales analytics

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ Protected file downloads
- ✅ Payment verification before download
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Helmet security headers
- ✅ Secure file upload with type validation

## 💳 Payment Integration

The application includes a **simulated UPI payment flow** for development and testing. For production deployment:

1. Integrate with a real payment gateway (Razorpay, PayU, Stripe, etc.)
2. Update `backend/utils/payment.utils.js` with actual API calls
3. Add payment gateway credentials to `.env`
4. Update frontend payment flow as needed

## 📦 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Update environment variables for production
3. Deploy to Heroku, Railway, Render, or your preferred platform
4. Ensure file upload directory is persistent or use cloud storage (AWS S3, Google Cloud Storage)

### Frontend Deployment
1. Update `NEXT_PUBLIC_API_URL` in `.env.local`
2. Build the application: `npm run build`
3. Deploy to Vercel, Netlify, or your preferred platform

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Browse and search books
- [ ] Add books to cart
- [ ] Checkout and payment flow
- [ ] Payment verification (success/failure)
- [ ] Download purchased books
- [ ] Admin login and dashboard
- [ ] Admin book management (CRUD)
- [ ] Admin user and order management

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
MAX_FILE_SIZE=52428800
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@bookstore.com
ADMIN_PASSWORD=Admin@123
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🤝 Contributing

This is a production-ready template. Feel free to customize and extend it for your needs.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Support

For issues or questions:
1. Check the API endpoints documentation
2. Verify environment variables are set correctly
3. Ensure MongoDB is running
4. Check browser console and server logs for errors

## 🎯 Future Enhancements

- [ ] Book reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Advanced search with filters
- [ ] Book recommendations
- [ ] Multiple payment methods
- [ ] Coupon/discount system
- [ ] Reading progress tracking
- [ ] Social sharing features

---

**Built with ❤️ using Node.js, Express, MongoDB, Next.js, and React**
