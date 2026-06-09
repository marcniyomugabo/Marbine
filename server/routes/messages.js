const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const messageController = require('../controllers/messageController');

router.get('/', required, messageController.getAll);
router.post('/', required, messageController.create);
router.delete('/:id', required, messageController.remove);

module.exports = router;
