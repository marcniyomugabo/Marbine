const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const analyticsController = require('../controllers/analyticsController');

router.get('/stats', required, adminOnly, analyticsController.getStats);

module.exports = router;
