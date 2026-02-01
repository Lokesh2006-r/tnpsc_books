const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { uploadCover, uploadBook } = require('../config/upload.config');

// Public routes
router.get('/featured', bookController.getFeaturedBooks);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

// Admin routes
router.post(
    '/',
    requireAuth,
    requireAdmin,
    uploadCover.fields([
        { name: 'coverImage', maxCount: 1 },
        { name: 'bookFile', maxCount: 1 }
    ]),
    bookController.createBookValidation,
    validate,
    bookController.createBook
);

router.put(
    '/:id',
    requireAuth,
    requireAdmin,
    uploadCover.fields([
        { name: 'coverImage', maxCount: 1 },
        { name: 'bookFile', maxCount: 1 }
    ]),
    bookController.updateBook
);

router.delete('/:id', requireAuth, requireAdmin, bookController.deleteBook);
router.patch('/:id/availability', requireAuth, requireAdmin, bookController.toggleAvailability);

module.exports = router;
