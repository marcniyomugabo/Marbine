const db = require('../config/db');

exports.getQuestions = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, question, options, category FROM love_quiz_questions ORDER BY RAND()');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'Answers are required' });
    }

    const [questions] = await db.query('SELECT id, correct_index FROM love_quiz_questions');
    const questionMap = {};
    for (const q of questions) questionMap[q.id] = q.correct_index;

    let score = 0;
    const details = [];
    for (const a of answers) {
      const correct = questionMap[a.question_id] === a.selected_index;
      if (correct) score++;
      details.push({ question_id: a.question_id, selected: a.selected_index, correct, correct_index: questionMap[a.question_id] });
    }

    await db.query(
      'INSERT INTO love_quiz_results (user_id, score, total, answers) VALUES (?, ?, ?, ?)',
      [req.user.id, score, answers.length, JSON.stringify(details)]
    );

    const [total] = await db.query('SELECT COUNT(*) as count FROM love_quiz_questions');
    const totalQuestions = total[0].count;

    const [hist] = await db.query(
      'SELECT score, total, created_at FROM love_quiz_results WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
      [req.user.id]
    );

    res.json({ score, total: answers.length, total_questions: totalQuestions, details, history: hist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT score, total, created_at FROM love_quiz_results WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.fullname, r.score, r.total, r.created_at
       FROM love_quiz_results r JOIN users u ON r.user_id = u.id
       ORDER BY (r.score * 1.0 / r.total) DESC, r.score DESC
       LIMIT 10`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
