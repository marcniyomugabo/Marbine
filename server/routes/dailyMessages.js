const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const dailyMessagesController = require('../controllers/dailyMessagesController');

router.get('/random', required, dailyMessagesController.getRandom);
router.get('/', required, dailyMessagesController.getAll);
router.post('/', required, dailyMessagesController.create);
router.delete('/:id', required, dailyMessagesController.remove);

module.exports = router;
