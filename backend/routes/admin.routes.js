const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth.middleware');

// All routes require admin authentication
router.use(requireAuth, requireAdmin);

// Dashboard
router.get('/stats', adminController.getDashboardStats);
router.get('/analytics', adminController.getSalesAnalytics);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserDetails);
router.patch('/users/:id/toggle-status', adminController.toggleUserStatus);

// Order management
router.get('/orders', adminController.getAllOrders);

// Transaction management
router.get('/transactions', adminController.getAllTransactions);

module.exports = router;
