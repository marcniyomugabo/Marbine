const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const wishlistController = require('../controllers/wishlistController');

router.get('/', required, wishlistController.getAll);
router.post('/', required, wishlistController.create);
router.put('/:id/purchase', required, wishlistController.markPurchased);
router.delete('/:id', required, wishlistController.remove);

module.exports = router;
