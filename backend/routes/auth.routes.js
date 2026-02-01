const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

// Public routes
router.post('/signup', authController.signupValidation, validate, authController.signup);
router.post('/login', authController.loginValidation, validate, authController.login);

// Protected routes
router.get('/me', requireAuth, authController.getMe);
router.put('/profile', requireAuth, authController.updateProfile);
router.put('/change-password', requireAuth, authController.changePasswordValidation, validate, authController.changePassword);

module.exports = router;
