const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const userController = require('../controllers/userController');

router.get('/', required, adminOnly, userController.getAll);
router.post('/', required, adminOnly, userController.create);
router.put('/:id/role', required, adminOnly, userController.updateRole);
router.delete('/:id', required, adminOnly, userController.remove);

module.exports = router;
