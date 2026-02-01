const express = require('express');
const router = express.Router();
const slideController = require('../controllers/slide.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth.middleware');

const { uploadCover } = require('../config/upload.config');

// Public routes
router.get('/', slideController.getSlides);

// Admin routes
router.get('/admin', requireAuth, requireAdmin, slideController.getAllSlides);
router.post('/', requireAuth, requireAdmin, uploadCover.single('image'), slideController.createSlide);
router.put('/:id', requireAuth, requireAdmin, uploadCover.single('image'), slideController.updateSlide);
router.delete('/:id', requireAuth, requireAdmin, slideController.deleteSlide);

module.exports = router;
