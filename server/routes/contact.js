const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const contactController = require('../controllers/contactController');

router.post('/', contactController.submit);
router.get('/', required, adminOnly, contactController.getAll);
router.delete('/:id', required, adminOnly, contactController.remove);

module.exports = router;
