const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const timelineController = require('../controllers/timelineController');

router.get('/', timelineController.getAll);
router.post('/', required, adminOnly, timelineController.create);
router.put('/:id', required, adminOnly, timelineController.update);
router.delete('/:id', required, adminOnly, timelineController.remove);

module.exports = router;
