const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    let query;
    let params;
    if (req.user.role === 'admin') {
      query = `SELECT m.*, u.fullname AS sender_name
               FROM messages m
               JOIN users u ON m.sender_id = u.id
               ORDER BY m.sent_at DESC`;
      params = [];
    } else {
      query = `SELECT m.*, u.fullname AS sender_name
               FROM messages m
               JOIN users u ON m.sender_id = u.id
               WHERE m.sender_id = ? OR m.receiver_id = ?
               ORDER BY m.sent_at DESC`;
      params = [req.user.id, req.user.id];
    }
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { receiver_id, subject, message } = req.body;
    if (!receiver_id || !message) {
      return res.status(400).json({ error: 'Receiver and message are required' });
    }
    const [result] = await db.query(
      'INSERT INTO messages (sender_id, receiver_id, subject, message) VALUES (?, ?, ?, ?)',
      [req.user.id, receiver_id, subject, message]
    );
    res.status(201).json({ id: result.insertId, message: 'Message sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM messages WHERE id = ? AND (sender_id = ? OR receiver_id = ?)',
      [req.params.id, req.user.id, req.user.id]
    );
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
