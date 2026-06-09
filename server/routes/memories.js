const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const memoryController = require('../controllers/memoryController');
const upload = require('../middleware/upload');

router.get('/', memoryController.getAll);
router.post('/', required, upload.single('image'), memoryController.create);
router.put('/:id', required, upload.single('image'), memoryController.update);
router.put('/:id/like', required, memoryController.like);
router.delete('/:id', required, memoryController.remove);

module.exports = router;
