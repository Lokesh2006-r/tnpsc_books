const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth.middleware');
const { initiatePayment, verifyPayment, getPaymentStatus, getPaymentHistory, adminVerifyPayment } = require('../controllers/payment.controller');

router.post('/initiate', requireAuth, initiatePayment);
router.post('/verify', requireAuth, verifyPayment);
router.get('/history', requireAuth, getPaymentHistory);
router.get('/:referenceId', requireAuth, getPaymentStatus);

// Admin route
router.put('/:id/approve', requireAuth, requireAdmin, adminVerifyPayment);

module.exports = router;
