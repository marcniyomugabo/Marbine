const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const authController = require('../controllers/authController');
const upload = require('../middleware/upload');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', required, authController.getProfile);
router.put('/profile', required, upload.single('profile_image'), authController.updateProfile);
router.get('/users', required, authController.getUsers);
router.put('/change-password', required, authController.changePassword);

module.exports = router;
