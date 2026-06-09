const express = require('express');
const router = express.Router();
const { required } = require('../middleware/auth');
const quizController = require('../controllers/quizController');

router.get('/questions', required, quizController.getQuestions);
router.post('/submit', required, quizController.submitQuiz);
router.get('/history', required, quizController.getHistory);

module.exports = router;
