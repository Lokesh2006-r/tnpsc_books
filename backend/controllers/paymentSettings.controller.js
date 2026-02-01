const PaymentSettings = require('../models/PaymentSettings');

// @desc    Get payment settings
// @route   GET /api/payment-settings
// @access  Public
exports.getPaymentSettings = async (req, res, next) => {
    try {
        let settings = await PaymentSettings.findOne({ isActive: true });

        // Create default settings if none exist
        if (!settings) {
            settings = await PaymentSettings.create({
                upiId: '9150315247@axl',
                merchantName: 'BookStore',
                qrCodeEnabled: true,
                isActive: true
            });
        }

        res.status(200).json({
            success: true,
            settings: {
                upiId: settings.upiId,
                merchantName: settings.merchantName,
                qrCodeEnabled: settings.qrCodeEnabled
            }
        });
    } catch (error) {
        console.error('Error fetching payment settings:', error);
        next(error);
    }
};

// @desc    Update payment settings
// @route   PUT /api/payment-settings
// @access  Private/Admin
exports.updatePaymentSettings = async (req, res, next) => {
    try {
        const { upiId, merchantName, qrCodeEnabled } = req.body;

        // Validate UPI ID format
        if (upiId && !isValidUPIId(upiId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid UPI ID format. Format should be: username@bankname'
            });
        }

        let settings = await PaymentSettings.findOne({ isActive: true });

        if (!settings) {
            // Create new settings
            settings = await PaymentSettings.create({
                upiId: upiId || '9150315247@axl',
                merchantName: merchantName || 'BookStore',
                qrCodeEnabled: qrCodeEnabled !== undefined ? qrCodeEnabled : true,
                isActive: true,
                updatedBy: req.user._id
            });
        } else {
            // Update existing settings
            if (upiId) settings.upiId = upiId;
            if (merchantName) settings.merchantName = merchantName;
            if (qrCodeEnabled !== undefined) settings.qrCodeEnabled = qrCodeEnabled;
            settings.updatedBy = req.user._id;
            await settings.save();
        }

        res.status(200).json({
            success: true,
            message: 'Payment settings updated successfully',
            settings: {
                upiId: settings.upiId,
                merchantName: settings.merchantName,
                qrCodeEnabled: settings.qrCodeEnabled
            }
        });
    } catch (error) {
        console.error('Error updating payment settings:', error);
        next(error);
    }
};

// Helper function to validate UPI ID
function isValidUPIId(upiId) {
    // UPI ID format: username@bankname
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    return upiRegex.test(upiId);
}
