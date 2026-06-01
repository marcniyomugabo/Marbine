const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const goalController = require('../controllers/goalController');

router.get('/', goalController.getAll);
router.post('/', required, adminOnly, goalController.create);
router.put('/:id', required, adminOnly, goalController.update);
router.delete('/:id', required, adminOnly, goalController.remove);

module.exports = router;
