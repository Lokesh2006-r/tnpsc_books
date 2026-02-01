const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth.middleware');
const { getPaymentSettings, updatePaymentSettings } = require('../controllers/paymentSettings.controller');

router.get('/', getPaymentSettings);
router.put('/', requireAuth, requireAdmin, updatePaymentSettings);

module.exports = router;
