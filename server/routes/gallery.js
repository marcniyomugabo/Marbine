const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const galleryController = require('../controllers/galleryController');
const upload = require('../middleware/upload');

router.get('/', galleryController.getAll);
router.post('/upload', required, adminOnly, upload.single('file'), galleryController.upload);
router.delete('/:id', required, adminOnly, galleryController.remove);

module.exports = router;
