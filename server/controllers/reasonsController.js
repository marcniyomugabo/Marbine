const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, u.fullname AS added_by_name
       FROM love_reasons r
       JOIN users u ON r.added_by = u.id
       ORDER BY r.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM love_reasons ORDER BY RAND() LIMIT 1');
    if (rows.length === 0) return res.json({ reason: 'You are amazing in every way!', category: null });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { reason, category } = req.body;
    if (!reason || !reason.trim()) return res.status(400).json({ error: 'Reason is required' });
    const [result] = await db.query(
      'INSERT INTO love_reasons (added_by, reason, category) VALUES (?, ?, ?)',
      [req.user.id, reason.trim(), category || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Reason added!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM love_reasons WHERE id = ?', [req.params.id]);
    res.json({ message: 'Reason removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
