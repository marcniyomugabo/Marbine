const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const analyticsController = require('../controllers/analyticsController');

router.get('/stats', required, adminOnly, analyticsController.getStats);
router.get('/love-stats', required, analyticsController.getLoveStats);

module.exports = router;
