const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const romanticController = require('../controllers/romanticController');

router.get('/daily-message', required, romanticController.getDailyMessage);
router.get('/check-special-day', required, romanticController.checkSpecialDay);

module.exports = router;
