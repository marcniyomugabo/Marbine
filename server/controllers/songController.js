const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT s.*, u.fullname AS added_by_name FROM songs s JOIN users u ON s.added_by = u.id ORDER BY s.sort_order ASC, s.created_at ASC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, artist, embed_url } = req.body;
    if (!title || !artist) return res.status(400).json({ error: 'Title and artist are required' });
    const [[{ maxOrder }]] = await db.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS maxOrder FROM songs');
    const [result] = await db.query(
      'INSERT INTO songs (title, artist, embed_url, added_by, sort_order) VALUES (?, ?, ?, ?, ?)',
      [title, artist, embed_url || null, req.user.id, maxOrder]
    );
    res.status(201).json({ id: result.insertId, message: 'Song added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM songs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Song removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
