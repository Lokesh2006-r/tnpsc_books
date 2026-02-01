const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

// User routes
router.post('/', requireAuth, orderController.createOrderValidation, validate, orderController.createOrder);
router.get('/', requireAuth, orderController.getUserOrders);
router.get('/:id', requireAuth, orderController.getOrderById);

// Admin routes
router.put('/:id/status', requireAuth, requireAdmin, orderController.updateOrderStatus);

module.exports = router;
