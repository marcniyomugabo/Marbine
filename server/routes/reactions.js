const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const reactionController = require('../controllers/reactionController');

router.get('/:memoryId', reactionController.getByMemory);
router.post('/:memoryId', required, reactionController.toggle);

module.exports = router;
