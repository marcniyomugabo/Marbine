const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const galleryController = require('../controllers/galleryController');
const upload = require('../middleware/upload');

router.get('/', galleryController.getAll);
router.post('/upload', required, upload.single('file'), galleryController.upload);
router.delete('/:id', required, galleryController.remove);

module.exports = router;
