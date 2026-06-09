const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const goalController = require('../controllers/goalController');

router.get('/', goalController.getAll);
router.post('/', required, goalController.create);
router.put('/:id', required, goalController.update);
router.delete('/:id', required, goalController.remove);

module.exports = router;
