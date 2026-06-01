const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const memoryController = require('../controllers/memoryController');
const upload = require('../middleware/upload');

router.get('/', memoryController.getAll);
router.post('/', required, adminOnly, upload.single('image'), memoryController.create);
router.put('/:id', required, adminOnly, upload.single('image'), memoryController.update);
router.put('/:id/like', required, adminOnly, memoryController.like);
router.delete('/:id', required, adminOnly, memoryController.remove);

module.exports = router;
