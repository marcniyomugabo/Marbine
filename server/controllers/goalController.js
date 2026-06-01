const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM goals ORDER BY target_date ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, target_date } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const [result] = await db.query(
      'INSERT INTO goals (title, description, target_date) VALUES (?, ?, ?)',
      [title, description, target_date]
    );
    res.status(201).json({ id: result.insertId, message: 'Goal created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, description, status, target_date } = req.body;
    await db.query(
      'UPDATE goals SET title = COALESCE(?, title), description = COALESCE(?, description), status = COALESCE(?, status), target_date = COALESCE(?, target_date) WHERE id = ?',
      [title, description, status, target_date, req.params.id]
    );
    res.json({ message: 'Goal updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM goals WHERE id = ?', [req.params.id]);
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
