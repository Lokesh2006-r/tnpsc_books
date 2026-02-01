const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/download.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/library', requireAuth, downloadController.getUserLibrary);
router.get('/history', requireAuth, downloadController.getDownloadHistory);
router.get('/check/:bookId', requireAuth, downloadController.checkDownloadAccess);
router.get('/:bookId', requireAuth, downloadController.downloadBook);

module.exports = router;
