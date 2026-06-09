const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const songController = require('../controllers/songController');

router.get('/', songController.getAll);
router.post('/', required, songController.create);
router.delete('/:id', required, songController.remove);

module.exports = router;
