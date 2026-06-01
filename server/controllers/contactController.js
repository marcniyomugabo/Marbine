const db = require('../config/db');
const { sendFeedbackEmail } = require('../config/email');

exports.submit = async (req, res) => {
  try {
    const { name, phone, email, location, comment } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
    if (!email || !email.trim()) return res.status(400).json({ error: 'Email is required' });
    if (!comment || !comment.trim()) return res.status(400).json({ error: 'Message is required' });

    const [result] = await db.query(
      'INSERT INTO feedback (name, phone, email, location, comment) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), phone || null, email.trim(), location || null, comment.trim()]
    );

    try {
      await sendFeedbackEmail({ name, phone, email, location, comment });
    } catch (emailErr) {
      console.error('Email send failed:', emailErr.message);
    }

    res.status(201).json({ id: result.insertId, message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('Feedback submit error:', err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM feedback ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM feedback WHERE id = ?', [req.params.id]);
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
