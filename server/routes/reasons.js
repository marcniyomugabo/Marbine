const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const reasonsController = require('../controllers/reasonsController');

router.get('/', required, reasonsController.getAll);
router.get('/random', required, reasonsController.getRandom);
router.post('/', required, reasonsController.create);
router.delete('/:id', required, reasonsController.remove);

module.exports = router;
