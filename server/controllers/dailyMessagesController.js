const db = require('../config/db');

exports.getRandom = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM love_messages ORDER BY RAND() LIMIT 1');
    if (rows.length === 0) return res.json({ message: 'You are loved! 💖' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM love_messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) return res.status(400).json({ error: 'Message is required' });
    const [result] = await db.query('INSERT INTO love_messages (message) VALUES (?)', [message.trim()]);
    res.status(201).json({ id: result.insertId, message: 'Love message added!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM love_messages WHERE id = ?', [req.params.id]);
    res.json({ message: 'Message removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
