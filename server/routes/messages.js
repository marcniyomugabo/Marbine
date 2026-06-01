const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const messageController = require('../controllers/messageController');

router.get('/', required, adminOnly, messageController.getAll);
router.post('/', required, adminOnly, messageController.create);
router.delete('/:id', required, adminOnly, messageController.remove);

module.exports = router;
