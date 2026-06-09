const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const moodController = require('../controllers/moodController');

router.get('/', required, moodController.getByUser);
router.get('/range', required, moodController.getByDateRange);
router.post('/', required, moodController.createOrUpdate);
router.delete('/:id', required, moodController.remove);

module.exports = router;
