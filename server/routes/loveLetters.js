const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const letterController = require('../controllers/loveLetterController');

router.get('/', required, letterController.getAll);
router.post('/', required, letterController.create);
router.put('/:id/open', required, letterController.markOpened);
router.post('/:id/unlock', required, letterController.unlockByPassword);
router.delete('/:id', required, letterController.remove);

module.exports = router;
