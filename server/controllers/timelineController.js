const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM timeline ORDER BY event_date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, event_date } = req.body;
    if (!title || !event_date) {
      return res.status(400).json({ error: 'Title and event date are required' });
    }
    const [result] = await db.query(
      'INSERT INTO timeline (title, description, event_date) VALUES (?, ?, ?)',
      [title, description, event_date]
    );
    res.status(201).json({ id: result.insertId, message: 'Timeline event created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, description, event_date } = req.body;
    await db.query(
      'UPDATE timeline SET title = COALESCE(?, title), description = COALESCE(?, description), event_date = COALESCE(?, event_date) WHERE id = ?',
      [title, description, event_date, req.params.id]
    );
    res.json({ message: 'Timeline event updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM timeline WHERE id = ?', [req.params.id]);
    res.json({ message: 'Timeline event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
